import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus, PaymentStatus } from '@/lib/types';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, deliveryPartnerName, deliveryPartnerPhone, cancellationReason } = body;

    let updated = null;

    if (status) {
      updated = await db.updateOrderStatus(id, status as OrderStatus, {
        deliveryPartnerName,
        deliveryPartnerPhone,
        cancellationReason,
      });
    }

    if (paymentStatus) {
      updated = await db.updateOrderPaymentStatus(id, paymentStatus as PaymentStatus, body.paymentId);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
