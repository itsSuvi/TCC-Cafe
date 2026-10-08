'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, Product } from '@/lib/types';
import ProductCard from '@/components/common/ProductCard';
import {
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  X,
  Flame,
  ArrowUpDown,
  UtensilsCrossed,
} from 'lucide-react';

interface MenuClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function MenuClient({ initialCategories, initialProducts }: MenuClientProps) {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [isBestSellerOnly, setIsBestSellerOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // Veg Only
    if (isVegOnly) {
      list = list.filter((p) => p.vegType === 'VEG');
    }

    // Best Seller Only
    if (isBestSellerOnly) {
      list = list.filter((p) => p.isBestSeller);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, isVegOnly, isBestSellerOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setIsVegOnly(false);
    setIsBestSellerOnly(false);
    setSortBy('default');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    isVegOnly ||
    isBestSellerOnly ||
    sortBy !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162B1D] text-[#E7C86A] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Classic Crush Menu</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#23140C]">
          Explore Our Handcrafted Menu
        </h1>
        <p className="text-xs sm:text-sm text-[#6B635B]">
          Freshly made everyday by culinary chefs. Customize your waffle with extra toppings, choose spice levels,
          and enjoy delicious quick bites.
        </p>
      </div>

      {/* Search Bar & Primary Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EADDCF] shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#6B635B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for waffles, pizza, momos, coffee, burger, maggie, patties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF6F0] border border-[#EADDCF] focus:border-[#C89B2B] rounded-2xl pl-12 pr-10 py-3.5 text-sm text-[#23140C] placeholder:text-[#6B635B]/70 focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B635B] hover:text-[#23140C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#162B1D] text-white shadow-xs scale-105'
                : 'bg-[#FAF6F0] text-[#5A3922] hover:bg-[#F4ECE1] border border-[#EADDCF]'
            }`}
          >
            All Delicacies ({initialProducts.length})
          </button>
          {initialCategories.map((cat) => {
            const count = initialProducts.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#162B1D] text-white shadow-xs scale-105'
                    : 'bg-[#FAF6F0] text-[#5A3922] hover:bg-[#F4ECE1] border border-[#EADDCF]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Bar */}
        <div className="pt-2 border-t border-[#EADDCF]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Veg Only Toggle */}
            <button
              type="button"
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${
                isVegOnly
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs'
                  : 'bg-white border-[#EADDCF] text-[#5A3922] hover:bg-[#FAF6F0]'
              }`}
            >
              <div className="w-3 h-3 border border-emerald-600 rounded-[2px] flex items-center justify-center bg-white">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              </div>
              <span>Veg Only</span>
            </button>

            {/* Best Seller Only */}
            <button
              type="button"
              onClick={() => setIsBestSellerOnly(!isBestSellerOnly)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                isBestSellerOnly
                  ? 'bg-amber-50 border-[#C89B2B] text-[#23140C] shadow-2xs'
                  : 'bg-white border-[#EADDCF] text-[#5A3922] hover:bg-[#FAF6F0]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C89B2B] fill-[#C89B2B]" />
              <span>Best Sellers</span>
            </button>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-800 font-bold underline ml-2"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#6B635B] font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF6F0] border border-[#EADDCF] rounded-xl px-3 py-1.5 text-xs font-bold text-[#23140C] focus:outline-hidden"
            >
              <option value="default">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B635B] px-1">
          <span>
            Showing <strong className="text-[#23140C]">{filteredProducts.length}</strong> delicacies
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-[#C89B2B]">
              {initialCategories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EADDCF] space-y-4 max-w-lg mx-auto shadow-sm my-12">
            <div className="w-16 h-16 bg-[#F4ECE1] text-[#C89B2B] rounded-full mx-auto flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#23140C]">
              No Delicious Delicacies Found
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              We couldn't find any items matching your current search or filters. Try clearing your filters or
              searching for something else like "waffle", "maggie", or "patty".
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="bg-[#162B1D] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
            >
              Explore Full Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
