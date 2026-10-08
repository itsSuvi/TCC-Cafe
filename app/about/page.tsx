import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ChefHat,
  Heart,
  Award,
  ShieldCheck,
  Clock,
  ArrowRight,
  Utensils,
  Store,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] bg-[#FFF8E7] px-4 py-1.5 rounded-full border border-[#E7C86A]/40 inline-block">
            Our Story & Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#23140C] leading-tight">
            Handcrafted with Passion. <br />
            <span className="text-[#8B5E34]">Made With Love.</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            <strong>The Classic Crush Bakery & Café</strong> is a proud signature culinary initiative by the{' '}
            <strong>School of Hotel Management</strong>, bringing handcrafted artisan pastries, decadent Belgian chocolate waffles, stone-baked pizzas, and specialty coffees to campus food lovers.
          </p>
        </div>

        {/* Big Banner Visual */}
        <div className="relative aspect-21/9 rounded-3xl overflow-hidden shadow-xl border border-[#EADDCF]">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
            alt="The Classic Crush Bakery & Kitchen"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E7C86A]">
                Culinary Excellence
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Where Student Artistry Meets Gourmet Flavors
              </h3>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center mx-auto shadow-xs">
              <ChefHat className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#23140C]">
              School of Hotel Management
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every dish is conceptualized and prepared under master chef guidance by budding hospitality and culinary talents.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#23140C]">
              Pure & Premium Ingredients
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              From rich Belgian chocolate and pure cream butter to freshly ground coffee beans and farm-fresh veggies, no compromises.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center mx-auto shadow-xs">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#23140C]">
              Freshly Baked Daily
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We bake small batches multiple times throughout the day, guaranteeing that every patty, bun, and cookie arrives warm and crisp.
            </p>
          </div>
        </div>

        {/* Quote & CTA */}
        <div className="bg-[#23140C] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 border border-[#3B2416]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#E7C86A]">
              Craving something delicious right now?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Explore our fresh menu of 30+ signature desserts, burgers, pizzas and shakes.
            </p>
          </div>

          <Link
            href="/menu"
            className="bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] font-black px-8 py-4 rounded-2xl text-sm tracking-wide shadow-md flex items-center gap-2 transition-all active:scale-98 shrink-0"
          >
            <span>Order Fresh Online</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
