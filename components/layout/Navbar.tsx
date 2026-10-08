'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingBag,
  Search,
  Clock,
  Phone,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  Menu as MenuIcon,
  X,
  Heart,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, subtotal, orderType, setOrderType } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin section, display the specialized admin header instead of customer navbar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Our Story', href: '/about' },
    { name: 'Track Order', href: '/orders' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EADDCF] transition-all">
      {/* Top Banner with Hotel Management tagline */}
      <div className="bg-[#162B1D] text-[#E7C86A] text-[11px] sm:text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E7C86A] animate-pulse"></span>
            <span>✨ An Initiative by <strong>School of Hotel Management</strong></span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-emerald-200">Freshly Made Everyday • 100% Love</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-white/70 hover:text-[#E7C86A] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
            <a
              href="tel:+918090205081"
              className="hidden sm:inline-flex items-center gap-1 text-white/90 hover:text-white font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>8090205081</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full border-2 border-[#C89B2B] bg-[#FFFDF9] flex flex-col items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-base text-[#23140C] leading-none tracking-tighter">
                T<span className="text-xs text-[#C89B2B]">CC</span>
              </span>
              <span className="text-[6px] tracking-widest text-[#23140C] uppercase font-bold mt-0.5">
                Bakery
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-black text-[#23140C] tracking-tight leading-none group-hover:text-[#162B1D] transition-colors">
                THE CLASSIC CRUSH
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-bold tracking-widest text-[#C89B2B] uppercase">
                  Bakery & Café
                </span>
                <span className="text-[10px] text-[#6B635B] italic">"Made With Love"</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-all hover:text-[#C89B2B] relative py-1 ${
                    isActive ? 'text-[#162B1D] font-bold' : 'text-[#5A3922]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C89B2B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Order Type Switcher, Search, and Cart */}
          <div className="flex items-center gap-3">
            {/* Delivery / Pickup Switcher */}
            <div className="hidden md:flex items-center bg-[#F4ECE1] p-1 rounded-full border border-[#EADDCF]">
              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  orderType === 'DELIVERY'
                    ? 'bg-[#162B1D] text-white shadow-xs'
                    : 'text-[#5A3922] hover:text-[#162B1D]'
                }`}
              >
                <MapPin className="w-3 h-3" />
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('PICKUP')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  orderType === 'PICKUP'
                    ? 'bg-[#162B1D] text-white shadow-xs'
                    : 'text-[#5A3922] hover:text-[#162B1D]'
                }`}
              >
                <Clock className="w-3 h-3" />
                Pickup
              </button>
            </div>

            {/* Menu Search shortcut */}
            <Link
              href="/menu"
              className="p-2.5 rounded-full text-[#3B2416] hover:bg-[#F4ECE1] transition-colors"
              title="Search Menu"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart Button with Count */}
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 bg-[#23140C] text-[#FAF6F0] px-4 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-[#162B1D] transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 text-[#E7C86A]" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 ? (
                <span className="bg-[#C89B2B] text-[#23140C] text-xs font-black px-2 py-0.5 rounded-full animate-bounce">
                  {itemCount} • {formatCurrency(subtotal)}
                </span>
              ) : (
                <span className="bg-white/20 text-white/80 text-xs px-1.5 py-0.5 rounded-full">0</span>
              )}
            </Link>

            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#3B2416] lg:hidden hover:bg-[#F4ECE1]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF6F0] border-b border-[#EADDCF] px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          {/* Order type switch for mobile */}
          <div className="flex items-center justify-center bg-[#F4ECE1] p-1 rounded-full border border-[#EADDCF] mb-4">
            <button
              type="button"
              onClick={() => {
                setOrderType('DELIVERY');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                orderType === 'DELIVERY'
                  ? 'bg-[#162B1D] text-white shadow-xs'
                  : 'text-[#5A3922]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Home Delivery
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderType('PICKUP');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                orderType === 'PICKUP'
                  ? 'bg-[#162B1D] text-white shadow-xs'
                  : 'text-[#5A3922]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pickup from Café
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-semibold ${
                  pathname === link.href
                    ? 'bg-[#162B1D] text-white'
                    : 'text-[#3B2416] hover:bg-[#F4ECE1]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-[#C89B2B] bg-[#23140C] flex items-center gap-2 justify-center"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
