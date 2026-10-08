import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import ProductCard from '@/components/common/ProductCard';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Clock,
  ShieldCheck,
  ChefHat,
  Utensils,
  MapPin,
  Flame,
  Award,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

export default async function HomePage() {
  const categories = await db.getCategories();
  const products = await db.getProducts();

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const signatureDesserts = products.filter((p) => p.categoryId === 'cat-desserts').slice(0, 4);
  const quickBites = products.filter((p) => p.categoryId === 'cat-quick-bites').slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#23140C] text-[#FAF6F0] py-16 sm:py-24 border-b border-[#3B2416]">
        {/* Background Bakery Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,43,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,67,45,0.25),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162B1D] border border-[#E7C86A]/40 text-[#E7C86A] text-xs font-bold tracking-wider uppercase shadow-md animate-pulse-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                <span>An Initiative by School of Hotel Management</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                  THE CLASSIC <br />
                  <span className="text-gold-gradient italic">CRUSH</span>
                </h1>
                <p className="font-serif text-xl sm:text-2xl text-[#E7C86A] italic font-medium tracking-wide">
                  Bakery & Café — "Made With Love"
                </p>
              </div>

              {/* Subheading text */}
              <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Handcrafted decadent chocolate waffles, oven-fresh masala patties, artisanal pizzas, gourmet burgers,
                and ice-cold beverages. Order online for lightning fast doorstep delivery or counter pickup.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/menu"
                  className="bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] font-black text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/menu"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wider uppercase px-7 py-4 rounded-full border border-white/20 transition-all hover:border-white"
                >
                  VIEW FULL MENU
                </Link>
              </div>

              {/* Quick Highlight Pills */}
              <div className="pt-6 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <span className="block font-serif text-lg font-bold text-[#E7C86A]">100%</span>
                  <span className="text-[11px] text-stone-300">Fresh Daily</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <span className="block font-serif text-lg font-bold text-[#E7C86A]">30 Mins</span>
                  <span className="text-[11px] text-stone-300">Fast Delivery</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <span className="block font-serif text-lg font-bold text-[#E7C86A]">40+ Items</span>
                  <span className="text-[11px] text-stone-300">Artisan Menu</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Decorative Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C89B2B]/40 bg-[#162B1D] aspect-4/5">
                  <Image
                    src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=900&q=80"
                    alt="Triple Chocolate Waffle"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Best Seller Badge */}
                  <div className="absolute top-4 left-4 bg-[#C89B2B] text-[#23140C] font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CHEF'S TOP SPECIAL</span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        100% PURE VEG
                      </span>
                      <span className="text-xs text-[#E7C86A] font-bold">₹69 Only</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold">Triple Chocolate Masterpiece</h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                      Dark, milk & white Belgian chocolate ganache poured over freshly pressed crispy waffle.
                    </p>
                  </div>
                </div>

                {/* Floating Micro-Card */}
                <div className="absolute -bottom-6 -left-6 bg-white text-[#23140C] p-3.5 rounded-2xl shadow-2xl border border-[#EADDCF] hidden sm:flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-[#162B1D] block">Hotel Management</span>
                    <span className="text-[11px] text-[#6B635B]">Culinary Craftsmanship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
            Explore Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
            Crafted for Every Craving
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] max-w-xl mx-auto">
            From oven-baked masala patties to triple chocolate dessert waffles, explore our full café spread.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className="group bg-white rounded-2xl p-3 sm:p-4 border border-[#EADDCF] hover:border-[#C89B2B] shadow-xs hover:shadow-lg transition-all text-center flex flex-col items-center hover:-translate-y-1"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 border-2 border-[#EADDCF] group-hover:border-[#C89B2B] group-hover:scale-105 transition-all">
                <Image
                  src={category.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80'}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#23140C] group-hover:text-[#162B1D] leading-tight">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-[#C89B2B] uppercase">
              <Flame className="w-4 h-4 fill-[#C89B2B]" />
              <span>Campus Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
              Most Loved Delicacies
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              The highest-rated treats prepared fresh everyday by our culinary chefs.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#162B1D] hover:text-[#C89B2B] group"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      {/* 4. "FRESHLY MADE EVERYDAY" PROMISE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#162B1D] rounded-3xl text-white p-8 sm:p-12 relative overflow-hidden border border-[#2D583B]">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#C89B2B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E7C86A] block">
                Pure Quality • Authentic Taste
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-white leading-tight">
                Freshly Made Everyday In Our Kitchen
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
                We believe great food starts with passion and the finest ingredients. Every batch of waffles is freshly
                pressed on order, our patties are slow-baked to golden flakiness, and our cold brews are blended to
                perfection. No stale preservatives. Just real love and hotel-grade culinary quality.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#E7C86A] shrink-0" />
                  <span className="text-xs font-semibold">100% Real Butter & Cocoa</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#E7C86A] shrink-0" />
                  <span className="text-xs font-semibold">Strict Hygiene Standards</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#E7C86A] shrink-0" />
                  <span className="text-xs font-semibold">Baked Fresh Every Morning</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <Link
                href="/menu"
                className="bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] font-black text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-center w-full sm:w-auto"
              >
                ORDER FRESH NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIGNATURE DESSERTS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
              Sweet Indulgence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
              Signature Desserts & Waffles
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              Belgian chocolate fantasies, Nutella waffles, and brownie cups starting at just ₹49.
            </p>
          </div>

          <Link
            href="/menu?category=cat-desserts"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#162B1D] hover:text-[#C89B2B] group"
          >
            <span>View All Desserts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureDesserts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. QUICK BITES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
              Crispy & Savory
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
              Hot Patties & Oven Pizzas
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              Crispy masala patties, Korean garlic cheese buns and cheesy personal pizzas.
            </p>
          </div>

          <Link
            href="/menu?category=cat-quick-bites"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#162B1D] hover:text-[#C89B2B] group"
          >
            <span>View All Quick Bites</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickBites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. GRAND OPENING & INVITATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#FAF6F0] rounded-3xl p-8 sm:p-12 border-2 border-[#C89B2B]/40 shadow-xl relative overflow-hidden text-center space-y-6">
          {/* Decorative Corner Ornaments */}
          <div className="w-20 h-20 rounded-full border-4 border-[#C89B2B]/20 bg-white mx-auto flex items-center justify-center shadow-md">
            <span className="font-serif font-black text-2xl text-[#23140C]">TCC</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B]">
              School of Hotel Management
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#23140C]">
              Grand Opening & Café Welcome
            </h2>
            <p className="font-serif text-lg text-[#5A3922] italic">
              "You are cordially invited to taste and experience our bakery and confectionery outlet."
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-6 text-sm text-[#23140C]">
            <div className="bg-white px-5 py-3 rounded-2xl border border-[#EADDCF] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#6B635B] block font-bold">
                Coordinator
              </span>
              <span className="font-bold font-serif text-base">Santosh Singh Tomar</span>
              <span className="text-xs text-[#C89B2B] block font-semibold mt-0.5">📞 8090205081</span>
            </div>

            <div className="bg-white px-5 py-3 rounded-2xl border border-[#EADDCF] shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#6B635B] block font-bold">
                Coordinator
              </span>
              <span className="font-bold font-serif text-base">Sandeep Singh</span>
              <span className="text-xs text-[#C89B2B] block font-semibold mt-0.5">📞 8318008104</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
