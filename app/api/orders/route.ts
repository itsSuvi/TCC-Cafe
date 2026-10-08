import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderItemRecord, OrderType, PaymentMethod, PaymentStatus, OrderStatus } from '@/lib/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') as OrderStatus) || undefined;
    const phone = searchParams.get('phone') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const orders = await db.getOrders({ status, phone, limit });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      items,
      couponCode,
      paymentMethod,
      deliveryAddress,
    } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone and at least one item are required' },
        { status: 400 }
      );
    }

    if (orderType === 'DELIVERY' && !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: 'Delivery address is required for Home Delivery orders' },
        { status: 400 }
      );
    }

    // SERVER-SIDE PRICE & ITEM RE-VALIDATION
    let calculatedSubtotal = 0;
    const verifiedItems: OrderItemRecord[] = [];

    for (const item of items) {
      const dbProduct = await db.getProductById(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.productName || item.productId}` },
          { status: 400 }
        );
      }

      if (!dbProduct.isAvailable) {
        return NextResponse.json(
          { success: false, error: `Sorry, "${dbProduct.name}" is currently sold out or unavailable.` },
          { status: 400 }
        );
      }

      let unitPrice = dbProduct.price;
      if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
        for (const opt of item.selectedOptions) {
          unitPrice += Number(opt.price || 0);
        }
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productImage: dbProduct.image,
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
        vegType: dbProduct.vegType,
        selectedOptions: item.selectedOptions || [],
        specialInstructions: item.specialInstructions || '',
      });
    }

    // Check minimum order value
    const deliverySettings = await db.getDeliverySettings();
    if (calculatedSubtotal < deliverySettings.minimumOrderValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount is ₹${deliverySettings.minimumOrderValue}. Please add more items to your cart.`,
        },
        { status: 400 }
      );
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    if (orderType === 'DELIVERY') {
      const distance = deliveryAddress?.distanceKm || 1.5;
      const deliveryCalc = await db.calculateDeliveryFee(distance, calculatedSubtotal);
      if (!deliveryCalc.isDeliverable) {
        return NextResponse.json(
          { success: false, error: deliveryCalc.reason || 'Address outside delivery radius' },
          { status: 400 }
        );
      }
      deliveryFee = deliveryCalc.deliveryFee;
    }

    // Coupon calculation
    let discount = 0;
    if (couponCode) {
      const couponValidation = await db.validateCoupon(couponCode, calculatedSubtotal);
      if (couponValidation.isValid) {
        discount = couponValidation.discount;
      }
    }

    // Calculate 5% GST tax
    const tax = Math.round((calculatedSubtotal - discount) * 0.05);
    const grandTotal = Math.max(0, calculatedSubtotal - discount + deliveryFee + tax);

    // Initial payment status
    let paymentStatus: PaymentStatus = 'PENDING';
    if (paymentMethod === 'COD' || paymentMethod === 'PAY_AT_CAFE') {
      paymentStatus = 'COD';
    } else if (paymentMethod === 'UPI' || paymentMethod === 'CARD' || paymentMethod === 'NET_BANKING') {
      // In prototype mode, payment simulation succeeds
      paymentStatus = 'PAID';
    }

    const estimatedTime =
      orderType === 'PICKUP'
        ? deliverySettings.estimatedPickupTimeMinutes
        : deliverySettings.estimatedDeliveryTimeMinutes;

    const newOrder = await db.createOrder({
      customerName,
      customerPhone,
      customerEmail,
      orderType: orderType as OrderType,
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      tax,
      discount,
      couponCode: discount > 0 ? couponCode : undefined,
      grandTotal,
      orderStatus: 'RECEIVED',
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus,
      paymentId: paymentStatus === 'PAID' ? `pay_sim_${Date.now()}` : undefined,
      deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
      estimatedTimeMinutes: estimatedTime || (orderType === 'DELIVERY' ? 30 : 15),
    });

    // Save address to user profile
    if (deliveryAddress && customerPhone) {
      await db.saveUserAddress(customerPhone, deliveryAddress).catch(() => {});
    }

    return NextResponse.json({ success: true, order: newOrder, data: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
