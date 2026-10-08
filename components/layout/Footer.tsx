'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Phone, Mail, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#23140C] text-[#FAF6F0] border-t border-[#3B2416] mt-auto">
      {/* Upper Instagram Banner / Scan Section */}
      <div className="bg-[#162B1D] py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#E7C86A]/40 flex items-center justify-center text-[#E7C86A] shrink-0">
                <InstagramIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E7C86A] block">
                  Scan to Follow Us
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Follow @theclassiccrush on Instagram
                </h3>
                <p className="text-sm text-stone-300">
                  Tag us in your sweetest food stories & get featured!
                </p>
              </div>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] px-6 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg transition-all hover:scale-105"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>FOLLOW ON INSTAGRAM</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Initiative */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#C89B2B] bg-[#FFFDF9] flex flex-col items-center justify-center p-0.5 shadow-xs">
                <span className="font-serif font-black text-base text-[#23140C] leading-none">
                  T<span className="text-xs text-[#C89B2B]">CC</span>
                </span>
                <span className="text-[6px] tracking-widest text-[#23140C] uppercase font-bold">
                  Bakery
                </span>
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-white leading-tight">
                  THE CLASSIC CRUSH
                </h4>
                <p className="text-xs text-[#E7C86A] font-semibold tracking-wider uppercase">
                  Bakery & Café
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              "Made With Love" — An initiative by <strong>School of Hotel Management</strong> bringing you
              handcrafted signature chocolate waffles, freshly baked artisan pastries, gourmet burgers, and specialty
              beverages.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#E7C86A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thank You for Supporting Local & Young! ❤️</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="font-serif text-lg font-bold text-[#E7C86A] tracking-wide">
              Explore Our Menu
            </h5>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/menu?category=cat-desserts" className="hover:text-[#E7C86A] transition-colors">
                  Signature Chocolate Desserts
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-quick-bites" className="hover:text-[#E7C86A] transition-colors">
                  Crispy Patties & Oven Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-sandwiches-maggi" className="hover:text-[#E7C86A] transition-colors">
                  Grilled Sandwiches & Hot Maggi
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-burgers" className="hover:text-[#E7C86A] transition-colors">
                  Gourmet Burgers & Cheesy Fries
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-momos" className="hover:text-[#E7C86A] transition-colors">
                  Steamed & Kurkure Momos
                </Link>
              </li>
              <li>
                <Link href="/menu?category=cat-beverages-pastries" className="hover:text-[#E7C86A] transition-colors">
                  Artisan Coffee, Shakes & Pastries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Café Hours */}
          <div className="space-y-4">
            <h5 className="font-serif text-lg font-bold text-[#E7C86A] tracking-wide">
              Café & Outlet Info
            </h5>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E7C86A] shrink-0 mt-1" />
                <span>School of Hotel Management Campus Outlet, University Road</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E7C86A] shrink-0" />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-white">Santosh Singh Tomar: 8090205081</span>
                  <span className="font-semibold text-white">Sandeep Singh: 8318008104</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E7C86A] shrink-0" />
                <span>theclassiccrush@gmail.com</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-stone-400">
                  🕒 <strong>Opening Hours:</strong> 10:00 AM – 10:30 PM (Mon - Sun)
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Quality Commitment */}
          <div className="space-y-4">
            <h5 className="font-serif text-lg font-bold text-[#E7C86A] tracking-wide">
              Our Promise
            </h5>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2 font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Freshly Made Everyday</span>
              </div>
              <p>
                Every single dessert, pastry and patty is prepared on-site by culinary students and chefs using premium
                cocoa, real butter, and pure ingredients.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E7C86A] hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Staff & Kitchen Portal Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 The Classic Crush. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> by School of Hotel
            Management
          </p>
        </div>
      </div>
    </footer>
  );
}
