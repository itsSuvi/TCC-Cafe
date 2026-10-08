'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  Store,
  MapPin,
  Phone,
  User,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  Lock,
  Heart,
  Smartphone,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    orderType,
    setOrderType,
    discount,
    couponCode,
    clearCart,
  } = useCart();

  // Contact info
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');

  // Address info
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Campus / University Road');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('226001');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [distanceKm, setDistanceKm] = useState(1.5);

  // Delivery timing & tip
  const [scheduleTime, setScheduleTime] = useState<'ASAP' | 'LATER'>('ASAP');
  const [tipAmount, setTipAmount] = useState<number>(0);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD' | 'PAY_AT_CAFE'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'QR'>('GPAY');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Auto-fill from user context if available
  useEffect(() => {
    if (user) {
      if (!customerName && user.name) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!customerEmail && user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  // Pricing calculations
  const FREE_DELIVERY_THRESHOLD = 199;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || orderType === 'PICKUP';
  const deliveryFee = orderType === 'PICKUP' ? 0 : isFreeDelivery ? 0 : 25;
  const packagingFee = subtotal > 0 ? 10 : 0;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal + gst + packagingFee + deliveryFee + tipAmount - discount);

  // Validate form before placing order
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      errors.name = 'Please enter your full name';
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (orderType === 'DELIVERY') {
      if (!houseFlat.trim()) {
        errors.houseFlat = 'Please enter Room / Flat / Department';
      }
      if (!street.trim()) {
        errors.street = 'Please enter Street or Hostel / Building name';
      }
      if (!pincode.trim() || pincode.length < 6) {
        errors.pincode = 'Enter 6-digit Pincode';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      router.push('/menu');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Creating your order with kitchen...');

    try {
      // Simulate live gateway steps
      if (paymentMethod === 'UPI' || paymentMethod === 'CARD') {
        setProcessingStep('Connecting to secure payment gateway...');
        await new Promise((r) => setTimeout(r, 800));
        setProcessingStep('Authorizing payment securely...');
        await new Promise((r) => setTimeout(r, 900));
      }

      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        orderType,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          vegType: item.product.vegType,
          selectedOptions: item.selectedOptions,
          specialInstructions: item.specialInstructions,
        })),
        subtotal,
        deliveryFee,
        tax: gst,
        discount,
        couponCode: couponCode || undefined,
        packagingFee,
        tipAmount,
        grandTotal,
        orderStatus: 'RECEIVED',
        paymentMethod: paymentMethod === 'COD' && orderType === 'PICKUP' ? 'PAY_AT_CAFE' : paymentMethod,
        paymentStatus: paymentMethod === 'COD' || paymentMethod === 'PAY_AT_CAFE' ? 'PENDING' : 'PAID',
        paymentId: paymentMethod !== 'COD' ? `pay_cc_${Date.now()}` : undefined,
        deliveryAddress:
          orderType === 'DELIVERY'
            ? {
                fullName: customerName.trim(),
                phoneNumber: customerPhone.trim(),
                houseFlat: houseFlat.trim(),
                street: street.trim(),
                area: area.trim(),
                landmark: landmark.trim() || undefined,
                pincode: pincode.trim(),
                city: 'Lucknow',
                instructions: deliveryNote.trim() || undefined,
                distanceKm: distanceKm || 1.5,
              }
            : undefined,
        estimatedTimeMinutes: orderType === 'DELIVERY' ? 30 : 15,
      };

      setProcessingStep('Transmitting order ticket to Bakery Chef...');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      setProcessingStep('Order confirmed! Redirecting to live tracker...');
      await new Promise((r) => setTimeout(r, 600));

      // Clear the local cart
      clearCart();

      // Navigate to live tracker
      router.push(`/track/${data.order.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      alert(`Error creating order: ${err.message || 'Please try again'}`);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFFDF9] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#EADDCF]">
          <h1 className="font-serif text-2xl font-bold text-[#23140C]">Your bag is empty</h1>
          <p className="text-xs text-stone-500">Please add items from the menu before checkout.</p>
          <Link
            href="/menu"
            className="inline-block bg-[#23140C] text-[#FFFDF9] py-3 px-6 rounded-2xl font-bold text-sm"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-[#23140C]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-[#EADDCF] animate-scale-up">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#EADDCF] border-t-[#C89B2B] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#C89B2B] animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#23140C]">Processing Your Order</h3>
              <p className="text-xs text-stone-600 mt-2 font-medium">{processingStep}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Encrypted Transaction</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Back & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/cart"
            className="w-10 h-10 rounded-2xl bg-white border border-[#EADDCF] flex items-center justify-center text-stone-700 hover:text-[#23140C] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
              The Classic Crush • Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
              Complete Your Order
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Fulfillment Selection */}
            <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#23140C] text-[#E7C86A] text-xs flex items-center justify-center font-sans font-bold">
                    1
                  </span>
                  <span>Fulfillment Method</span>
                </h2>
                <span className="text-xs font-bold text-[#8B5E34]">
                  {orderType === 'DELIVERY' ? 'Doorstep Delivery' : 'Pickup at Outlet'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'DELIVERY'
                      ? 'border-[#23140C] bg-[#23140C] text-white shadow-md'
                      : 'border-[#EADDCF] bg-[#FAF6F0] text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Truck className={`w-5 h-5 mb-2 ${orderType === 'DELIVERY' ? 'text-[#E7C86A]' : 'text-stone-500'}`} />
                  <span className="font-bold text-sm">Doorstep Delivery</span>
                  <span className={`text-[11px] ${orderType === 'DELIVERY' ? 'text-stone-300' : 'text-stone-500'}`}>
                    Direct to Hostel / Dept (25-35m)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'PICKUP'
                      ? 'border-[#23140C] bg-[#23140C] text-white shadow-md'
                      : 'border-[#EADDCF] bg-[#FAF6F0] text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Store className={`w-5 h-5 mb-2 ${orderType === 'PICKUP' ? 'text-[#E7C86A]' : 'text-stone-500'}`} />
                  <span className="font-bold text-sm">Takeaway / Pickup</span>
                  <span className={`text-[11px] ${orderType === 'PICKUP' ? 'text-stone-300' : 'text-stone-500'}`}>
                    School of Hotel Mgmt Counter (15m)
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Customer Contact Information */}
            <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#23140C] text-[#E7C86A] text-xs flex items-center justify-center font-sans font-bold">
                  2
                </span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Suvi Gupta"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white ${
                        formErrors.name ? 'border-red-500' : 'border-[#EADDCF]'
                      }`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white ${
                        formErrors.phone ? 'border-red-500' : 'border-[#EADDCF]'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Email Address (Optional for invoice)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. suvi@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Address (Only if Delivery) */}
            {orderType === 'DELIVERY' ? (
              <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#23140C] text-[#E7C86A] text-xs flex items-center justify-center font-sans font-bold">
                    3
                  </span>
                  <span>Delivery Address</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Room / Flat / Dept / Cabin *
                      </label>
                      <input
                        type="text"
                        value={houseFlat}
                        onChange={(e) => setHouseFlat(e.target.value)}
                        placeholder="e.g. Room 304, Hostel C / Cabin 4B"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white ${
                          formErrors.houseFlat ? 'border-red-500' : 'border-[#EADDCF]'
                        }`}
                      />
                      {formErrors.houseFlat && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.houseFlat}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Building / Hostel / Faculty Block *
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. Boys Hostel Block A / Academic Wing"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white ${
                          formErrors.street ? 'border-red-500' : 'border-[#EADDCF]'
                        }`}
                      />
                      {formErrors.street && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.street}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Area / Campus Zone
                      </label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="University Campus"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Central Library / Gate 2"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="226001"
                        maxLength={6}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white ${
                          formErrors.pincode ? 'border-red-500' : 'border-[#EADDCF]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                      Delivery Rider Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="e.g. Please call upon reaching gate, leave with guard..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF8E7] p-6 rounded-3xl border border-[#E7C86A] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#23140C] text-[#E7C86A] flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#23140C]">
                      Pickup Outlet Counter
                    </h3>
                    <p className="text-xs text-stone-700">
                      The Classic Crush Bakery & Café, School of Hotel Management Outlet
                    </p>
                  </div>
                </div>
                <div className="text-xs text-stone-600 bg-white/80 p-3 rounded-xl border border-[#EADDCF]">
                  ⏱️ Your items will be freshly prepared and kept hot/chilled at the counter in approximately <strong>15 minutes</strong> after placing the order.
                </div>
              </div>
            )}

            {/* Step 4: Payment Method Selection */}
            <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#23140C] text-[#E7C86A] text-xs flex items-center justify-center font-sans font-bold">
                  {orderType === 'DELIVERY' ? '4' : '3'}
                </span>
                <span>Select Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#C89B2B] bg-[#FFF8E7]'
                      : 'border-[#EADDCF] bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#23140C]">
                        {paymentMethod === 'UPI' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#23140C]"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#23140C] block">
                          Instant UPI & QR Code
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Google Pay, PhonePe, Paytm, BHIM or Dynamic QR
                        </span>
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 text-[#8B5E34]" />
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-4 pt-3 border-t border-[#EADDCF] flex flex-wrap gap-2">
                      {(['GPAY', 'PHONEPE', 'PAYTM', 'QR'] as const).map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUpiApp(app);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                            upiApp === app
                              ? 'bg-[#23140C] text-[#FFFDF9] border-[#23140C]'
                              : 'bg-white text-stone-700 border-[#EADDCF]'
                          }`}
                        >
                          {app === 'GPAY'
                            ? 'Google Pay'
                            : app === 'PHONEPE'
                            ? 'PhonePe'
                            : app === 'PAYTM'
                            ? 'Paytm UPI'
                            : 'Scan QR'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#C89B2B] bg-[#FFF8E7]'
                      : 'border-[#EADDCF] bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#23140C]">
                        {paymentMethod === 'CARD' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#23140C]"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#23140C] block">
                          Credit / Debit Cards
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Visa, MasterCard, RuPay Cards supported
                        </span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#8B5E34]" />
                  </div>
                </div>

                {/* Cash on Delivery / Pay at Counter */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#C89B2B] bg-[#FFF8E7]'
                      : 'border-[#EADDCF] bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#23140C]">
                        {paymentMethod === 'COD' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#23140C]"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#23140C] block">
                          {orderType === 'DELIVERY'
                            ? 'Cash on Delivery (COD)'
                            : 'Pay at Café Counter upon Pickup'}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Pay by Cash or UPI on receiving your fresh food
                        </span>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-[#8B5E34]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Tip Section */}
            {orderType === 'DELIVERY' && (
              <div className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#23140C]">
                      Tip Student Delivery Partner
                    </span>
                  </div>
                  {tipAmount > 0 && (
                    <span className="text-xs font-bold text-emerald-700">
                      ₹{tipAmount} added
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  100% of the tip goes directly to your student delivery partner.
                </p>
                <div className="flex gap-2">
                  {[0, 20, 30, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTipAmount(amt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        tipAmount === amt
                          ? 'bg-[#23140C] text-[#FFFDF9] border-[#23140C]'
                          : 'bg-[#FAF6F0] text-stone-700 border-[#EADDCF]'
                      }`}
                    >
                      {amt === 0 ? 'No Tip' : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-sm space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADDCF]">
                <h3 className="font-serif text-lg font-bold text-[#23140C]">
                  Order Summary ({itemCount} items)
                </h3>
                <Link
                  href="/cart"
                  className="text-xs font-bold text-[#8B5E34] hover:underline"
                >
                  Edit Bag
                </Link>
              </div>

              {/* Items List Mini */}
              <div className="max-h-56 overflow-y-auto divide-y divide-[#EADDCF]/60 pr-1 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-[#23140C] shrink-0">
                        {item.quantity}x
                      </span>
                      <span className="truncate text-stone-800 font-medium">
                        {item.product.name}
                      </span>
                    </div>
                    <span className="font-bold text-[#23140C] shrink-0">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2.5 pt-3 border-t border-[#EADDCF] text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST Taxes (5%)</span>
                  <span className="font-semibold text-stone-800">₹{gst}</span>
                </div>

                <div className="flex justify-between">
                  <span>Eco Packaging Fee</span>
                  <span className="font-semibold text-stone-800">₹{packagingFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-stone-800">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                {tipAmount > 0 && (
                  <div className="flex justify-between text-stone-800 font-medium">
                    <span>Delivery Partner Tip</span>
                    <span>₹{tipAmount}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span>Coupon ({couponCode})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-[#EADDCF] flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-bold text-[#23140C] block">
                    Total Payable
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Inclusive of all taxes
                  </span>
                </div>
                <span className="font-serif text-3xl font-black text-[#23140C]">
                  ₹{grandTotal}
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] py-4 rounded-2xl font-black text-base tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>Place Order & Pay ₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>By placing order you agree to our Terms & Freshness Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
