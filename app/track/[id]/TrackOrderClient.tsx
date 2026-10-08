'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/lib/types';
import VegBadge from '@/components/common/VegBadge';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  Phone,
  MessageSquare,
  MapPin,
  FileText,
  RotateCcw,
  Sparkles,
  Store,
  ChevronRight,
  AlertTriangle,
  Receipt,
  Printer,
  ShieldCheck,
} from 'lucide-react';

interface TrackOrderClientProps {
  initialOrder: Order;
}

const STATUS_STEPS: {
  status: OrderStatus;
  label: string;
  desc: string;
  icon: any;
}[] = [
  {
    status: 'RECEIVED',
    label: 'Order Placed',
    desc: 'Order received at Bakery Counter',
    icon: FileText,
  },
  {
    status: 'CONFIRMED',
    label: 'Confirmed',
    desc: 'Bakery kitchen accepted order',
    icon: CheckCircle2,
  },
  {
    status: 'PREPARING',
    label: 'Baking & Preparing',
    desc: 'Freshly crafting in kitchen',
    icon: ChefHat,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    desc: 'Partner en route to your location',
    icon: Bike,
  },
  {
    status: 'DELIVERED',
    label: 'Delivered / Picked Up',
    desc: 'Delivered fresh with love',
    icon: PackageCheck,
  },
];

export default function TrackOrderClient({ initialOrder }: TrackOrderClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [minutesLeft, setMinutesLeft] = useState(
    order.orderStatus === 'DELIVERED' ? 0 : order.estimatedTimeMinutes || 25
  );

  // Poll for order status updates every 6 seconds
  useEffect(() => {
    if (order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (err) {
        console.warn('Live order polling error:', err);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [order.id, order.orderStatus]);

  // Countdown timer simulation
  useEffect(() => {
    if (minutesLeft <= 0 || order.orderStatus === 'DELIVERED') return;
    const timer = setInterval(() => {
      setMinutesLeft((prev) => Math.max(1, prev - 1));
    }, 60000);
    return () => clearInterval(timer);
  }, [minutesLeft, order.orderStatus]);

  // Determine current step index
  const getStepIndex = (status: OrderStatus) => {
    if (status === 'CANCELLED') return -1;
    if (status === 'READY') return 3;
    const idx = STATUS_STEPS.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIndex = getStepIndex(order.orderStatus);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `Hi Classic Crush Bakery! I need an update regarding my order #${order.orderNumber} (${order.customerName}).`
    );
    window.open(`https://wa.me/918090205081?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Celebration / Status Card */}
        <div className="bg-gradient-to-br from-[#23140C] via-[#3B2416] to-[#23140C] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          {/* Decorative Sparkle */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ChefHat className="w-48 h-48 text-[#E7C86A]" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="bg-[#C89B2B] text-[#23140C] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Live Order Tracking
              </span>
              <span className="font-mono text-xs sm:text-sm text-[#E7C86A] font-bold">
                Order #{order.orderNumber}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h1 className="font-serif text-2xl sm:text-4xl font-black text-white">
                  {order.orderStatus === 'DELIVERED'
                    ? '🎉 Order Delivered!'
                    : order.orderStatus === 'CANCELLED'
                    ? '⚠️ Order Cancelled'
                    : order.orderStatus === 'OUT_FOR_DELIVERY'
                    ? '🚴 Out for Campus Delivery!'
                    : order.orderStatus === 'PREPARING'
                    ? '👨‍🍳 Freshly Baking in Kitchen'
                    : 'Order Placed Successfully!'}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  {order.orderType === 'DELIVERY'
                    ? 'Delivering fresh to your campus address'
                    : 'Ready for takeaway pickup at School of Hotel Mgmt'}
                </p>
              </div>

              {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
                  <div className="text-xs text-stone-300 flex items-center gap-1 justify-center sm:justify-end">
                    <Clock className="w-3.5 h-3.5 text-[#E7C86A]" />
                    <span>Estimated Arrival</span>
                  </div>
                  <span className="font-serif text-2xl font-black text-[#E7C86A]">
                    ~{minutesLeft} mins
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Status Progress Pipeline */}
        {order.orderStatus !== 'CANCELLED' ? (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#23140C]">
                Preparation & Delivery Status
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                Live updates automatically sync
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="relative">
              {/* Connecting line on desktop */}
              <div className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[#EADDCF] -z-0">
                <div
                  className="bg-[#C89B2B] h-full transition-all duration-700"
                  style={{
                    width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.status}
                      className={`flex md:flex-col items-center md:text-center gap-4 md:gap-2 p-3 rounded-2xl transition-all ${
                        isCurrent
                          ? 'bg-[#FFF8E7] border border-[#E7C86A]'
                          : isDone
                          ? 'bg-stone-50/50'
                          : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                          isCurrent
                            ? 'bg-[#23140C] text-[#E7C86A] shadow-md scale-110 ring-4 ring-[#E7C86A]/40 animate-pulse'
                            : isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="text-left md:text-center">
                        <span
                          className={`font-serif text-xs font-bold block ${
                            isCurrent
                              ? 'text-[#23140C]'
                              : isDone
                              ? 'text-emerald-800'
                              : 'text-stone-500'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] text-stone-500 block leading-tight">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-200 flex items-center gap-4 text-red-800">
            <AlertTriangle className="w-8 h-8 shrink-0 text-red-600" />
            <div>
              <h3 className="font-bold text-base">This order has been cancelled</h3>
              <p className="text-xs text-red-600 mt-0.5">
                {order.cancellationReason || 'Please contact our outlet team for assistance or a refund.'}
              </p>
            </div>
          </div>
        )}

        {/* Delivery / Pickup Contact Card */}
        {order.orderType === 'DELIVERY' && order.deliveryAddress ? (
          <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </div>
              <p className="font-bold text-sm text-[#23140C]">
                {order.deliveryAddress.fullName} ({order.deliveryAddress.phoneNumber})
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}, {order.deliveryAddress.area},{' '}
                {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </p>
              {order.deliveryAddress.instructions && (
                <p className="text-[11px] text-stone-500 italic bg-[#FAF6F0] p-2 rounded-xl border border-[#EADDCF]">
                  Rider Note: "{order.deliveryAddress.instructions}"
                </p>
              )}
            </div>

            {/* Simulated Delivery Partner */}
            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EADDCF] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A3922]">
                  Delivery Assigned
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  On Campus Fleet
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#23140C] text-[#E7C86A] flex items-center justify-center font-bold text-sm">
                  {order.deliveryPartnerName ? order.deliveryPartnerName[0] : 'R'}
                </div>
                <div>
                  <span className="font-bold text-xs text-[#23140C] block">
                    {order.deliveryPartnerName || 'Rahul Verma (Student Partner)'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {order.deliveryPartnerPhone || '+91 8090205081'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${order.deliveryPartnerPhone || '8090205081'}`}
                  className="flex-1 bg-white hover:bg-stone-50 text-[#23140C] py-2 px-3 rounded-xl border border-[#EADDCF] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Rider</span>
                </a>
                <button
                  type="button"
                  onClick={handleWhatsAppHelp}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] border border-[#E7C86A] flex items-center justify-center text-[#8B5E34]">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider block">
                  Self Pickup Counter
                </span>
                <h3 className="font-serif text-base font-bold text-[#23140C]">
                  School of Hotel Management Outlet
                </h3>
                <p className="text-xs text-stone-600">
                  Show your Order #{order.orderNumber} at the pickup window.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppHelp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Café</span>
            </button>
          </div>
        )}

        {/* Itemized Order Receipt Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EADDCF]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#23140C]">
                Order Items & Invoice
              </h2>
              <span className="text-xs text-stone-500">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="bg-[#FAF6F0] hover:bg-stone-200 text-[#23140C] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#EADDCF] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Items list */}
          <div className="divide-y divide-[#EADDCF]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <VegBadge vegType={item.vegType} size="sm" />
                  <div>
                    <span className="font-bold text-sm text-[#23140C]">
                      {item.quantity}x {item.productName}
                    </span>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="text-[11px] text-stone-500">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="text-[10px] text-stone-400 italic">
                        "{item.specialInstructions}"
                      </div>
                    )}
                  </div>
                </div>
                <span className="font-bold text-sm text-[#23140C]">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-[#EADDCF] space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-800">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-stone-800">₹{order.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-stone-800">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#EADDCF] flex justify-between text-sm sm:text-base font-bold text-[#23140C]">
              <span>Grand Total</span>
              <span className="font-serif text-lg font-black text-[#23140C]">
                ₹{order.grandTotal}
              </span>
            </div>
            <div className="pt-1 flex justify-between text-[11px] text-stone-500">
              <span>Payment Mode: {order.paymentMethod}</span>
              <span
                className={`font-bold ${
                  order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                Status: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/menu"
            className="w-full sm:w-auto bg-[#23140C] text-[#FFFDF9] hover:bg-[#3B2416] py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
          >
            <span>Explore Menu & Order More</span>
            <ChevronRight className="w-4 h-4 text-[#E7C86A]" />
          </Link>

          <Link
            href="/orders"
            className="w-full sm:w-auto bg-white hover:bg-stone-50 text-[#23140C] py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm border border-[#EADDCF] flex items-center justify-center gap-2 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-[#8B5E34]" />
            <span>View All Past Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
