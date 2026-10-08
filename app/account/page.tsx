'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function AccountPage() {
  const { user, login, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert('Phone number is required');
      return;
    }
    login(phone, name, email);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
            The Classic Crush • Profile
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
            My Account & Preferences
          </h1>
        </div>

        {/* Profile Card & Info */}
        <div className="bg-white rounded-3xl border border-[#EADDCF] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[#EADDCF]">
            <div className="w-16 h-16 rounded-full bg-[#23140C] text-[#E7C86A] flex items-center justify-center font-black text-2xl">
              {name ? name[0].toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#23140C]">
                {name || 'Classic Crush Member'}
              </h2>
              <p className="text-xs text-stone-500">{phone || 'Login with mobile to track orders'}</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated and saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Suvi Gupta"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Mobile Number (Primary)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 8090205081"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. suvi@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#23140C] text-[#FFFDF9] hover:bg-[#3B2416] px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-[#E7C86A]" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Quick Links Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs hover:border-[#8B5E34] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#8B5E34] group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#23140C] block">
                  Past Orders & Live Status
                </span>
                <span className="text-[11px] text-stone-500">
                  Track delivery or reorder in 1-click
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#23140C] transition-colors" />
          </Link>

          <Link
            href="/menu"
            className="bg-white p-5 rounded-3xl border border-[#EADDCF] shadow-2xs hover:border-[#8B5E34] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#8B5E34] group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#23140C] block">
                  Explore Menu Treats
                </span>
                <span className="text-[11px] text-stone-500">
                  Waffles, pizzas, burgers & shakes
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#23140C] transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
