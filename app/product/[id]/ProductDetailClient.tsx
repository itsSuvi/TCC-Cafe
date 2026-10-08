'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, CartItemOption, CustomizationGroup } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import VegBadge from '@/components/common/VegBadge';
import ProductCard from '@/components/common/ProductCard';
import {
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Heart,
  Share2,
  Utensils,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedToast, setAddedToast] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate pricing based on options
  const basePrice = product.price;
  const optionsExtra = selectedOptions.reduce((sum, opt) => sum + (opt.price || 0), 0);
  const unitPrice = basePrice + optionsExtra;
  const totalPrice = unitPrice * quantity;

  const handleSelectRadioOption = (group: CustomizationGroup, option: { id: string; name: string; price: number }) => {
    setSelectedOptions((prev) => {
      // Remove other options from same group
      const filtered = prev.filter((o) => o.groupId !== group.id);
      return [
        ...filtered,
        {
          groupId: group.id,
          groupTitle: group.title,
          groupName: group.title,
          optionId: option.id,
          optionName: option.name,
          price: option.price,
        },
      ];
    });
  };

  const handleToggleCheckboxOption = (group: CustomizationGroup, option: { id: string; name: string; price: number }) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.optionId === option.id);
      if (exists) {
        return prev.filter((o) => o.optionId !== option.id);
      } else {
        return [
          ...prev,
          {
            groupId: group.id,
            groupTitle: group.title,
            groupName: group.title,
            optionId: option.id,
            optionName: option.name,
            price: option.price,
          },
        ];
      }
    });
  };

  const handleAddToCart = (openDrawer = false) => {
    addToCart(product, quantity, selectedOptions, specialInstructions);

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${product.name} | The Classic Crush Bakery`,
          text: `Check out ${product.name} at The Classic Crush!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] pt-6 pb-20">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#23140C] text-[#FFFDF9] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#C89B2B] animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="font-bold text-sm">Added to your bag!</p>
            <p className="text-xs text-stone-300">
              {quantity}x {product.name} (₹{totalPrice})
            </p>
          </div>
          <Link
            href="/cart"
            className="ml-3 bg-[#C89B2B] text-[#23140C] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#E7C86A]"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium">
          <Link href="/" className="hover:text-[#23140C] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/menu" className="hover:text-[#23140C] transition-colors">
            Menu
          </Link>
          {product.categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/menu?category=${product.categoryId}`}
                className="hover:text-[#23140C] transition-colors"
              >
                {product.categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#8B5E34] font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#EADDCF] shadow-sm p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Product Image & Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-3xl overflow-hidden bg-[#FAF6F0] border border-[#EADDCF]/60 group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-stone-100">
                    <VegBadge vegType={product.vegType} size="sm" showLabel />
                  </div>
                  {product.isBestSeller && (
                    <div className="bg-gradient-to-r from-amber-500 to-[#C89B2B] text-[#23140C] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-[#23140C]" />
                      <span>Best Seller</span>
                    </div>
                  )}
                </div>

                {/* Actions: Favorite & Share */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-red-500 shadow-md transition-transform active:scale-90"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? 'text-red-500 fill-red-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-[#23140C] shadow-md transition-transform active:scale-90"
                    aria-label="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Tagline or category pill at bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#E7C86A]" />
                    {product.preparationTimeMinutes || product.prepTimeMinutes || 15} Mins Fresh Prep Time
                  </span>
                  <span className="font-semibold text-[#E7C86A]">
                    School of Hotel Mgmt.
                  </span>
                </div>
              </div>

              {/* Highlights & Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-[#FAF6F0] p-3 rounded-2xl text-center border border-[#EADDCF]/50">
                  <Sparkles className="w-5 h-5 text-[#C89B2B] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#23140C] block">
                    Handcrafted
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Artisan Recipe
                  </span>
                </div>
                <div className="bg-[#FAF6F0] p-3 rounded-2xl text-center border border-[#EADDCF]/50">
                  <Clock className="w-5 h-5 text-[#C89B2B] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#23140C] block">
                    Freshly Baked
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Made to Order
                  </span>
                </div>
                <div className="bg-[#FAF6F0] p-3 rounded-2xl text-center border border-[#EADDCF]/50">
                  <ShieldCheck className="w-5 h-5 text-[#C89B2B] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#23140C] block">
                    100% Pure
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Premium Butter
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Information & Customization */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E34] bg-[#F7EFE6] px-3 py-1 rounded-full">
                    {product.categoryName || 'Bakery & Café'}
                  </span>
                  <div className="flex items-center gap-1.5 bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#E7C86A]/40 text-stone-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span className="font-black text-xs sm:text-sm">
                      {product.rating || 4.9}
                    </span>
                    <span className="text-xs text-stone-500">
                      ({product.ratingCount || 120}+ reviews)
                    </span>
                  </div>
                </div>

                {/* Product Name & Price */}
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#23140C] tracking-tight leading-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-black text-[#23140C]">
                    ₹{unitPrice}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 text-stone-600 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>

                {/* Ingredients & Allergens if present */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mt-5 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADDCF]/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#5A3922] uppercase tracking-wider mb-2">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Key Ingredients & Taste Notes</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white text-stone-700 px-2.5 py-1 rounded-lg border border-[#EADDCF]/70 shadow-2xs font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Customization Groups */}
                {product.customizations && product.customizations.length > 0 && (
                  <div className="mt-6 space-y-5">
                    {product.customizations.map((group) => {
                      const isRadio = group.type === 'radio';

                      return (
                        <div key={group.id} className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#23140C] block">
                              {group.title}
                            </label>
                            {group.required && (
                              <span className="text-[10px] text-red-500 font-bold uppercase">
                                Required
                              </span>
                            )}
                          </div>

                          <div className={isRadio ? 'grid grid-cols-2 sm:grid-cols-3 gap-2.5' : 'space-y-2'}>
                            {group.options.map((opt) => {
                              const isSelected = selectedOptions.some((o) => o.optionId === opt.id);

                              if (isRadio) {
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleSelectRadioOption(group, opt)}
                                    className={`p-3 rounded-2xl text-left border transition-all text-xs font-semibold flex flex-col justify-between gap-1 ${
                                      isSelected
                                        ? 'border-[#23140C] bg-[#23140C] text-white shadow-md'
                                        : 'border-[#EADDCF] bg-white text-stone-800 hover:border-[#8B5E34]'
                                    }`}
                                  >
                                    <span>{opt.name}</span>
                                    <span
                                      className={`text-[11px] font-bold ${
                                        isSelected ? 'text-[#E7C86A]' : 'text-stone-500'
                                      }`}
                                    >
                                      {opt.price > 0 ? `+₹${opt.price}` : 'Included'}
                                    </span>
                                  </button>
                                );
                              }

                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleToggleCheckboxOption(group, opt)}
                                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-xs ${
                                    isSelected
                                      ? 'border-[#C89B2B] bg-[#FFF8E7] text-[#23140C]'
                                      : 'border-[#EADDCF] bg-white text-stone-700 hover:border-stone-400'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                                        isSelected
                                          ? 'bg-[#23140C] border-[#23140C] text-[#E7C86A]'
                                          : 'border-stone-300 bg-white'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className="font-semibold text-stone-800">
                                      {opt.name}
                                    </span>
                                  </div>
                                  <span className="font-bold text-[#8B5E34]">
                                    +₹{opt.price}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Special Instructions */}
                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#23140C] block mb-2">
                    Kitchen Note / Cooking Preference (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Extra hot chocolate sauce, less spicy, no onions..."
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] bg-white"
                  />
                </div>
              </div>

              {/* Bottom Sticky Add to Cart Actions */}
              <div className="pt-6 border-t border-[#EADDCF] space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between bg-[#FAF6F0] border border-[#EADDCF] rounded-2xl p-1.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-800 hover:bg-stone-100 shadow-2xs font-bold transition-all active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-base text-[#23140C]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-800 hover:bg-stone-100 shadow-2xs font-bold transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={!product.isAvailable}
                    className="w-full sm:flex-1 bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#E7C86A]" />
                    <span>
                      {product.isAvailable
                        ? `Add to Bag • ₹${totalPrice}`
                        : 'Currently Sold Out'}
                    </span>
                  </button>

                  {/* Buy Now / Quick Checkout */}
                  {product.isAvailable && (
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full sm:w-auto bg-[#C89B2B] hover:bg-[#E7C86A] text-[#23140C] py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide shadow-md transition-all active:scale-98"
                    >
                      Order Now
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-6 text-xs text-stone-500 pt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Freshly Prepared
                  </span>
                  <span>•</span>
                  <span>Contactless Delivery Available</span>
                  <span>•</span>
                  <span>Direct Kitchen Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
                More Delicious Treats
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#23140C]">
                Pair It With
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-xs sm:text-sm font-bold text-[#8B5E34] hover:text-[#23140C] flex items-center gap-1"
            >
              View Full Menu <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
