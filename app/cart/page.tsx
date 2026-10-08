'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import VegBadge from '@/components/common/VegBadge';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Ticket,
  ChevronRight,
  Truck,
  Store,
  Info,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
} from 'lucide-react';

const SUGGESTED_COUPONS = [
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF',
    desc: 'On minimum order of ₹199',
    minOrder: 199,
  },
  {
    code: 'CHOCOCRUSH',
    title: '15% OFF Desserts & Shakes',
    desc: 'Up to ₹100 discount on orders > ₹250',
    minOrder: 250,
  },
  {
    code: 'HOTELMGMT20',
    title: '20% Student Special',
    desc: 'School of Hotel Mgmt special offer',
    minOrder: 150,
  },
];

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    orderType,
    setOrderType,
    couponCode,
    discount,
    couponMessage,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Pricing calculations
  const FREE_DELIVERY_THRESHOLD = 199;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || orderType === 'PICKUP';
  const deliveryFee = orderType === 'PICKUP' ? 0 : isFreeDelivery ? 0 : 25;
  const packagingFee = subtotal > 0 ? 10 : 0;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal + gst + packagingFee + deliveryFee - discount);

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setApplying(true);
    setCouponError('');
    const res = await applyCoupon(code);
    setApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFFDF9] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#EADDCF] shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF6F0] border-2 border-[#EADDCF] flex items-center justify-center text-[#8B5E34]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#23140C]">
              Your Bag is Empty
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-500">
              Looks like you haven't added any fresh baked treats or gourmet burgers yet.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-98"
          >
            <span>Explore Delicious Menu</span>
            <ArrowRight className="w-4 h-4 text-[#E7C86A]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
              The Classic Crush Order Bag
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
              Review Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="self-start sm:self-auto text-xs font-bold text-stone-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        {/* Free Delivery Bar for Delivery Orders */}
        {orderType === 'DELIVERY' && (
          <div className="mb-8 bg-gradient-to-r from-[#23140C] to-[#3B2416] text-white p-4 sm:p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E7C86A]" />
                <span>
                  {isFreeDelivery
                    ? '🎉 You have unlocked FREE Campus Delivery!'
                    : `Add ₹${amountNeededForFreeDelivery} more to get FREE Delivery!`}
                </span>
              </div>
              <span className="text-xs text-[#E7C86A] font-bold">
                {freeDeliveryProgress}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C89B2B] to-[#E7C86A] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Cart Items List & Fulfillment Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Fulfillment Mode Toggle */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EADDCF] shadow-2xs">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5A3922] block mb-3">
                How would you like to receive your order?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                    orderType === 'DELIVERY'
                      ? 'bg-[#23140C] text-[#FFFDF9] border-[#23140C] shadow-md'
                      : 'bg-[#FAF6F0] text-stone-700 border-[#EADDCF] hover:bg-stone-100'
                  }`}
                >
                  <Truck className={`w-4 h-4 ${orderType === 'DELIVERY' ? 'text-[#E7C86A]' : ''}`} />
                  <span>Doorstep Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                    orderType === 'PICKUP'
                      ? 'bg-[#23140C] text-[#FFFDF9] border-[#23140C] shadow-md'
                      : 'bg-[#FAF6F0] text-stone-700 border-[#EADDCF] hover:bg-stone-100'
                  }`}
                >
                  <Store className={`w-4 h-4 ${orderType === 'PICKUP' ? 'text-[#E7C86A]' : ''}`} />
                  <span>Takeaway / Pickup</span>
                </button>
              </div>
            </div>

            {/* Cart Items Cards */}
            <div className="bg-white rounded-3xl border border-[#EADDCF] shadow-2xs divide-y divide-[#EADDCF]">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#EADDCF]/60">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <VegBadge vegType={item.product.vegType} size="sm" />
                        <Link
                          href={`/product/${item.product.id}`}
                          className="font-serif font-bold text-base text-[#23140C] hover:text-[#8B5E34] transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </div>

                      <div className="text-xs font-semibold text-[#8B5E34] mt-0.5">
                        ₹{item.unitPrice} per unit
                      </div>

                      {/* Selected Options / Add-ons */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.selectedOptions.map((opt, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-[#FAF6F0] text-stone-600 px-2 py-0.5 rounded-md border border-[#EADDCF]"
                            >
                              {opt.optionName} {opt.price > 0 && `(+₹${opt.price})`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Special instruction text */}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-stone-500 italic mt-1">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Total Price */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                    <div className="flex items-center bg-[#FAF6F0] border border-[#EADDCF] rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-800 hover:bg-stone-100 shadow-2xs transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#23140C]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-800 hover:bg-stone-100 shadow-2xs transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-serif font-black text-base text-[#23140C]">
                        ₹{item.totalPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1.5"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add More Items Link */}
            <div className="flex justify-between items-center bg-[#FAF6F0] p-4 rounded-2xl border border-[#EADDCF]">
              <span className="text-xs text-[#5A3922] font-semibold">
                Craving another chocolate dessert or quick bite?
              </span>
              <Link
                href="/menu"
                className="text-xs font-bold text-[#8B5E34] hover:text-[#23140C] flex items-center gap-1"
              >
                <span>Add More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Coupon Box & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coupon Code Section */}
            <div className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#23140C] uppercase tracking-wider">
                <Ticket className="w-4 h-4 text-[#C89B2B]" />
                <span>Apply Promo Coupon</span>
              </div>

              {couponCode ? (
                <div className="bg-[#FFF8E7] border border-[#E7C86A] p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono font-black text-sm text-[#23140C]">
                        {couponCode}
                      </span>
                      <p className="text-xs text-stone-600">{couponMessage}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-600 hover:underline px-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="ENTER COUPON CODE"
                      className="flex-1 uppercase font-mono text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={applying || !inputCode.trim()}
                      className="bg-[#23140C] text-[#FFFDF9] px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#3B2416] transition-all disabled:opacity-50"
                    >
                      {applying ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <div className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </div>
                  )}

                  {/* Available Suggested Coupons */}
                  <div className="pt-2 border-t border-[#EADDCF]/60 space-y-2">
                    <span className="text-[11px] font-bold text-stone-500 block uppercase">
                      Available Offers:
                    </span>
                    <div className="space-y-2">
                      {SUGGESTED_COUPONS.map((sc) => (
                        <div
                          key={sc.code}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EADDCF]/70 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <Tag className="w-3 h-3 text-[#C89B2B]" />
                              <span className="font-mono font-bold text-[#23140C]">
                                {sc.code}
                              </span>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                                {sc.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500">{sc.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon(sc.code)}
                            className="text-xs font-bold text-[#8B5E34] hover:text-[#23140C] hover:underline"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Details / Price Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#23140C]">
                Bill Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST Taxes (5%)</span>
                  <span className="font-semibold text-stone-800">₹{gst}</span>
                </div>

                <div className="flex justify-between">
                  <span>Artisan Eco-Packaging</span>
                  <span className="font-semibold text-stone-800">₹{packagingFee}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <span>Delivery Charges</span>
                    {orderType === 'PICKUP' ? (
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        Pickup
                      </span>
                    ) : isFreeDelivery ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        FREE
                      </span>
                    ) : null}
                  </div>
                  <span className="font-semibold text-stone-800">
                    {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#EADDCF] flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-bold text-[#23140C] block">
                    To Pay (Grand Total)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Inclusive of taxes & packaging
                  </span>
                </div>
                <span className="font-serif text-3xl font-black text-[#23140C]">
                  ₹{grandTotal}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] py-4 rounded-2xl font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#C89B2B]" />
                <span>Estimated arrival in 25–35 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
