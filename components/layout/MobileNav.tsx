'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { Home, UtensilsCrossed, ShoppingBag, Clock, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : null,
    },
    { label: 'Orders', href: '/orders', icon: Clock },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#EADDCF] md:hidden shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive ? 'text-[#162B1D]' : 'text-[#6B635B] hover:text-[#23140C]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px] text-[#162B1D]' : 'stroke-2'
                  }`}
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#C89B2B] text-[#23140C] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  isActive ? 'font-black text-[#162B1D]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-[#C89B2B] rounded-full absolute bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
