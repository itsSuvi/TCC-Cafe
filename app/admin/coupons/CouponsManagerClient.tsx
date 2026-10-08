'use client';

import React, { useState, useEffect } from 'react';
import { Coupon } from '@/lib/types';
import { Tag, Plus, Trash2, CheckCircle2, X, AlertCircle } from 'lucide-react';

export default function CouponsManagerClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'FLAT' as 'FLAT' | 'PERCENTAGE',
    discountValue: 50,
    minimumOrderAmount: 199,
    maxDiscountAmount: 100,
    description: 'Special campus discount offer',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      discountValue: Number(formData.discountValue),
      minimumOrderAmount: Number(formData.minimumOrderAmount),
      maxDiscountAmount: Number(formData.maxDiscountAmount),
    };

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        alert('Failed to save coupon');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      alert('Failed to update coupon');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
            Promotions & Discounts
          </span>
          <h1 className="font-serif text-3xl font-black text-[#23140C]">
            Promo Coupons ({coupons.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({
              code: '',
              discountType: 'FLAT',
              discountValue: 50,
              minimumOrderAmount: 199,
              maxDiscountAmount: 100,
              description: 'Campus promotional offer',
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-[#E7C86A]" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
              coupon.isActive ? 'border-[#EADDCF]' : 'border-stone-200 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-[#23140C] bg-[#FAF6F0] px-3 py-1 rounded-xl border border-[#EADDCF]">
                  {coupon.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(coupon)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    coupon.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {coupon.isActive ? 'Active ✓' : 'Inactive'}
                </button>
              </div>

              <div>
                <span className="font-serif text-2xl font-black text-[#8B5E34]">
                  {coupon.discountType === 'FLAT'
                    ? `₹${coupon.discountValue} FLAT OFF`
                    : `${coupon.discountValue}% OFF`}
                </span>
                <p className="text-xs text-stone-600 mt-1">{coupon.description}</p>
              </div>

              <div className="text-xs text-stone-500 pt-2 border-t border-[#EADDCF]/60">
                Min Order: <strong>₹{coupon.minimumOrderAmount}</strong>
                {coupon.discountType === 'PERCENTAGE' && (
                  <span> • Max Discount: ₹{coupon.maxDiscountAmount}</span>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EADDCF] flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(coupon.id, coupon.code)}
                className="p-2 rounded-xl border border-[#EADDCF] hover:bg-red-50 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EADDCF] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADDCF]">
              <h3 className="font-serif text-lg font-bold text-[#23140C]">
                Create Promo Coupon
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Coupon Code (e.g. TASTY30) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full uppercase font-mono px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'FLAT' | 'PERCENTAGE',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EADDCF] bg-white"
                  >
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minimumOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumOrderAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
                />
              </div>

              <div className="pt-3 border-t border-[#EADDCF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EADDCF] text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#23140C] text-[#FFFDF9] font-bold"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
