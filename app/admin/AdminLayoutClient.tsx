'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Settings,
  Store,
  LogOut,
  Bell,
  ChefHat,
  Menu as MenuIcon,
  X,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Live Orders', icon: ShoppingBag, exact: true },
  { href: '/admin/products', label: 'Menu Catalog', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/coupons', label: 'Promo Coupons', icon: Tag },
  { href: '/admin/settings', label: 'Outlet Settings', icon: Settings },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // If on login page, render children directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('classic_crush_admin_session');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row text-stone-800">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#23140C] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#3B2416]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#C89B2B] text-[#23140C] flex items-center justify-center font-bold">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">
            Classic Crush Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-xs bg-white/10 hover:bg-white/20 text-[#E7C86A] px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <span>Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-stone-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#23140C] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo & Outlet info */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C89B2B] to-[#E7C86A] text-[#23140C] flex items-center justify-center font-bold shadow-md shrink-0">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-serif font-black text-sm tracking-wide text-white leading-tight">
                THE CLASSIC CRUSH
              </h2>
              <span className="text-[10px] text-[#E7C86A] font-bold uppercase tracking-wider block">
                Bakery Command Center
              </span>
            </div>
          </div>

          {/* Outlet status badge */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-semibold">
                {isStoreOpen ? 'Outlet is OPEN' : 'Outlet is CLOSED'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className="text-[10px] text-[#E7C86A] hover:underline uppercase font-bold"
            >
              Toggle
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#C89B2B] text-[#23140C] shadow-md'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#23140C]' : 'text-[#E7C86A]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between text-xs text-stone-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#E7C86A]" />
              <span>View Customer Store</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
