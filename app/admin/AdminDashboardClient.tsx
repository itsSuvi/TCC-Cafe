'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Order, OrderStatus } from '@/lib/types';
import VegBadge from '@/components/common/VegBadge';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
  ChefHat,
  Phone,
  RefreshCw,
  Printer,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX,
  Sparkles,
  Bike,
} from 'lucide-react';

export default function AdminDashboardClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    completedOrders: 0,
  });

  const loadOrdersAndStats = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch('/api/orders?limit=50'),
        fetch('/api/admin/stats'),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.orders) setOrders(ordersData.orders);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh every 5s
  useEffect(() => {
    loadOrdersAndStats();
    const interval = setInterval(loadOrdersAndStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    partnerName?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          deliveryPartnerName: partnerName || undefined,
        }),
      });

      if (res.ok) {
        loadOrdersAndStats();
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert('Error communicating with server');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const reason = prompt('Please enter cancellation reason for customer:');
    if (!reason) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: 'CANCELLED',
          cancellationReason: reason,
        }),
      });

      if (res.ok) {
        loadOrdersAndStats();
      }
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') {
      return ['RECEIVED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'READY'].includes(
        o.orderStatus
      );
    }
    return o.orderStatus === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
            School of Hotel Management • Outlet Command
          </span>
          <h1 className="font-serif text-3xl font-black text-[#23140C]">
            Live Orders Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Audio Alerts ON' : 'Audio Muted'}</span>
          </button>

          <button
            type="button"
            onClick={loadOrdersAndStats}
            className="bg-white hover:bg-stone-50 border border-[#EADDCF] text-stone-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C89B2B] flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[#23140C] block">
            ₹{stats.totalRevenue || 0}
          </span>
          <span className="text-[11px] text-stone-400">
            From {stats.totalOrders || 0} total orders
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              New / Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-amber-700 block">
            {stats.pendingOrders || 0}
          </span>
          <span className="text-[11px] text-stone-400">Needs kitchen confirmation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Baking / In Oven
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-blue-700 block">
            {stats.preparingOrders || 0}
          </span>
          <span className="text-[11px] text-stone-400">Active in kitchen</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-700 block">
            {stats.completedOrders || 0}
          </span>
          <span className="text-[11px] text-stone-400">Delivered / Picked up</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[#EADDCF]">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'ACTIVE', label: '⚡ Active Stream' },
          { id: 'RECEIVED', label: 'Received (New)' },
          { id: 'PREPARING', label: 'In Kitchen' },
          { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? 'bg-[#23140C] text-[#FFFDF9] shadow-md'
                : 'bg-white text-stone-600 border border-[#EADDCF] hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid / Stream */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EADDCF] text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#23140C]">
            No orders under this filter
          </h3>
          <p className="text-xs text-stone-500">
            Incoming customer orders from campus will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const isNew = order.orderStatus === 'RECEIVED';
            const isPreparing = order.orderStatus === 'PREPARING';
            const isOutForDelivery = order.orderStatus === 'OUT_FOR_DELIVERY';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isNew
                    ? 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/20'
                    : 'border-[#EADDCF]'
                }`}
              >
                {/* Header */}
                <div className="p-5 border-b border-[#EADDCF]/70 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-[#23140C]">
                        #{order.orderNumber}
                      </span>
                      {order.orderType === 'DELIVERY' ? (
                        <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                          <Truck className="w-3 h-3" /> Delivery
                        </span>
                      ) : (
                        <span className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
                          <Store className="w-3 h-3" /> Pickup
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-xs text-stone-600">
                      <strong className="text-stone-900">{order.customerName}</strong> •{' '}
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-[#8B5E34] hover:underline font-semibold"
                      >
                        {order.customerPhone}
                      </a>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="text-right">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : order.orderStatus === 'PREPARING'
                          ? 'bg-amber-100 text-amber-900 animate-pulse'
                          : order.orderStatus === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-100 text-blue-900 animate-pulse'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 space-y-3 flex-1">
                  <div className="divide-y divide-[#EADDCF]/60 max-h-48 overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <VegBadge vegType={item.vegType} size="sm" />
                          <span className="font-bold text-[#23140C]">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-stone-800 truncate">
                            {item.productName}
                          </span>
                        </div>
                        <span className="font-bold text-[#23140C] shrink-0">
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address snippet if delivery */}
                  {order.orderType === 'DELIVERY' && order.deliveryAddress && (
                    <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#EADDCF] text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Delivery Address
                      </span>
                      <p className="text-stone-700">
                        {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street},{' '}
                        {order.deliveryAddress.area}
                      </p>
                      {order.deliveryAddress.instructions && (
                        <p className="text-[11px] text-stone-500 italic">
                          "{order.deliveryAddress.instructions}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payment & Grand Total Info */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EADDCF]">
                    <span className="text-stone-500">
                      Payment: <strong className="text-stone-800">{order.paymentMethod}</strong> (
                      <span
                        className={
                          order.paymentStatus === 'PAID'
                            ? 'text-emerald-700 font-bold'
                            : 'text-amber-700 font-bold'
                        }
                      >
                        {order.paymentStatus}
                      </span>
                      )
                    </span>
                    <span className="font-serif font-black text-lg text-[#23140C]">
                      ₹{order.grandTotal}
                    </span>
                  </div>
                </div>

                {/* Status Action Workflow Bar */}
                <div className="p-4 bg-[#FAF6F0] border-t border-[#EADDCF] rounded-b-3xl flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="p-2 rounded-xl bg-white border border-[#EADDCF] text-stone-600 hover:text-[#23140C] transition-colors"
                      title="Print KOT / Order Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-xs text-red-600 hover:underline font-bold px-2 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Quick Status Advance Button */}
                  <div className="flex items-center gap-2">
                    {order.orderStatus === 'RECEIVED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                        className="bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-colors"
                      >
                        Accept Order ✓
                      </button>
                    )}

                    {order.orderStatus === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        className="bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <ChefHat className="w-3.5 h-3.5 text-[#E7C86A]" />
                        <span>Start Baking / Prep</span>
                      </button>
                    )}

                    {order.orderStatus === 'PREPARING' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            order.id,
                            order.orderType === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'READY',
                            'Rahul Verma (Student Partner)'
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        {order.orderType === 'DELIVERY' ? (
                          <>
                            <Bike className="w-3.5 h-3.5" />
                            <span>Dispatch Delivery</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Ready for Pickup</span>
                          </>
                        )}
                      </button>
                    )}

                    {(order.orderStatus === 'OUT_FOR_DELIVERY' || order.orderStatus === 'READY') && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
