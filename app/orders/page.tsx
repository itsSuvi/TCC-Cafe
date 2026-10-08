'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import VegBadge from '@/components/common/VegBadge';
import {
  ShoppingBag,
  Search,
  Clock,
  RotateCcw,
  ChevronRight,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  Phone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function OrdersHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [searchPhone, setSearchPhone] = useState(user?.phone || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOrders = async (phoneToQuery?: string) => {
    const qPhone = (phoneToQuery !== undefined ? phoneToQuery : searchPhone).trim();
    setLoading(true);
    try {
      const url = qPhone ? `/api/orders?phone=${encodeURIComponent(qPhone)}` : '/api/orders?limit=20';
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    fetchOrders(user?.phone || '');
  }, [user]);

  const handleReorder = (order: Order) => {
    // Add all valid items back to cart
    for (const item of order.items) {
      addToCart(
        {
          id: item.productId,
          name: item.productName,
          slug: item.productId,
          categoryId: 'cat-reorder',
          categoryName: 'Reorder Item',
          description: '',
          price: item.unitPrice,
          image: item.productImage,
          vegType: item.vegType,
          isAvailable: true,
        },
        item.quantity,
        item.selectedOptions
      );
    }
    router.push('/cart');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="bg-red-100 text-red-800 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case 'PREPARING':
        return (
          <span className="bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-600" /> Baking & Preparing
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <Truck className="w-3 h-3" /> Out for Delivery
          </span>
        );
      default:
        return (
          <span className="bg-stone-100 text-stone-800 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
              The Classic Crush • Orders
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
              Your Order History
            </h1>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm"
          >
            <span>Order New Treats</span>
            <ArrowRight className="w-4 h-4 text-[#E7C86A]" />
          </Link>
        </div>

        {/* Search by Phone Box */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EADDCF] shadow-2xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrders();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Search orders by 10-digit mobile number (e.g. 8090205081)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-[#23140C] text-[#FFFDF9] px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#3B2416] transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find My Orders</span>
            </button>
          </form>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-[#EADDCF] animate-pulse h-40"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-[#EADDCF] text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8B5E34] mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#23140C]">
              {hasSearched && searchPhone
                ? `No orders found for ${searchPhone}`
                : 'No orders recorded yet'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Check out our freshly baked chocolate waffles, patties, gourmet burgers and artisan coffees.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-[#C89B2B] text-[#23140C] font-bold text-xs px-6 py-3 rounded-2xl hover:bg-[#E7C86A]"
            >
              Explore Full Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#EADDCF] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-[#FAF6F0] p-4 sm:p-5 border-b border-[#EADDCF] flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#23140C]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-stone-400">•</span>
                      <span className="text-xs text-stone-600 font-medium">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      {order.orderType === 'DELIVERY' ? (
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#8B5E34]" /> Doorstep Delivery
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-[#8B5E34]" /> Pickup at Outlet
                        </span>
                      )}
                      <span>•</span>
                      <span>{order.customerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-serif font-black text-lg text-[#23140C]">
                      ₹{order.grandTotal}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#EADDCF]/70"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[#EADDCF]/60">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <VegBadge vegType={item.vegType} size="sm" />
                            <span className="font-bold text-xs text-[#23140C] truncate">
                              {item.quantity}x {item.productName}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8B5E34] font-semibold">
                            ₹{item.totalPrice}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="pt-4 border-t border-[#EADDCF] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-stone-500">
                      Payment Mode: <strong className="text-stone-800">{order.paymentMethod}</strong> ({order.paymentStatus})
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="bg-[#FAF6F0] hover:bg-stone-200 text-[#23140C] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#EADDCF] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#8B5E34]" />
                        <span>Reorder</span>
                      </button>

                      <Link
                        href={`/track/${order.id}`}
                        className="bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <span>Live Status</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#E7C86A]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
