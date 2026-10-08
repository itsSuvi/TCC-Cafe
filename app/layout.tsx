import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Classic Crush | Bakery & Café — Made With Love',
  description:
    'An initiative by School of Hotel Management. Order handcrafted signature desserts, chocolate waffles, freshly baked patties, artisan pizzas, burgers, momos, and specialty beverages online.',
  keywords: [
    'The Classic Crush',
    'Bakery & Cafe',
    'School of Hotel Management',
    'Desserts',
    'Waffles',
    'Patties',
    'Pizza',
    'Cold Coffee',
    'Momos',
    'Online Food Ordering',
  ],
  openGraph: {
    title: 'The Classic Crush | Bakery & Café — Made With Love',
    description: 'Freshly handcrafted desserts, snacks, and beverages. Order online for instant delivery and cafe pickup.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#1E1B18] antialiased selection:bg-[#C89B2B]/20 selection:text-[#23140C]">
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div className="h-16 bg-[#FFFDF9]" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <Suspense fallback={null}>
                <MobileNav />
              </Suspense>
              <Suspense fallback={null}>
                <FloatingWhatsApp />
              </Suspense>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
