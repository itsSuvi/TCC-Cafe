'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import VegBadge from './VegBadge';
import ProductCustomizationModal from './ProductCustomizationModal';
import { Sparkles, Heart, Plus, Check, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Check if product is in cart (base item)
  const cartItem = items.find((i) => i.productId === product.id && i.selectedOptions.length === 0);
  const totalQtyInCart = items
    .filter((i) => i.productId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const hasCustomizations = product.customizations && product.customizations.length > 0;
  const favorite = isFavorite(product.id);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.isAvailable) return;

    if (hasCustomizations) {
      setModalOpen(true);
    } else {
      addToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 900);
    }
  };

  const handleQuickIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleQuickDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  return (
    <>
      <div
        className={`group relative bg-white rounded-3xl overflow-hidden border border-[#EADDCF] hover:border-[#C89B2B]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col ${
          !product.isAvailable ? 'opacity-75 grayscale-[30%]' : ''
        }`}
      >
        {/* Image Container with links to detail page */}
        <div className="relative aspect-4/3 w-full bg-[#F4ECE1] overflow-hidden">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Badges: Veg & Best Seller */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <div className="bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs">
              <VegBadge vegType={product.vegType} size="sm" />
            </div>
            {product.isBestSeller && (
              <span className="bg-[#C89B2B] text-[#23140C] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-[#23140C]" /> BEST SELLER
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform hover:scale-110 z-10 ${
              favorite
                ? 'bg-red-50 text-red-500 shadow-sm'
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 stroke-red-500' : ''}`} />
          </button>

          {/* Out of Stock Overlay */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-20">
              <span className="bg-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <Link href={`/product/${product.id}`} className="group-hover:text-[#162B1D] transition-colors">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#23140C] leading-snug line-clamp-1">
                  {product.name}
                </h3>
              </Link>
            </div>

            <p className="text-xs text-[#6B635B] line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Section */}
          <div className="mt-4 pt-3 border-t border-[#EADDCF]/70 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#23140C]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-[#6B635B] line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              {hasCustomizations && (
                <span className="text-[10px] text-[#C89B2B] font-bold tracking-tight">
                  Customizable
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div>
              {!product.isAvailable ? (
                <button
                  disabled
                  className="px-3 py-1.5 text-xs font-bold text-stone-400 bg-stone-100 rounded-full cursor-not-allowed"
                >
                  Unavailable
                </button>
              ) : hasCustomizations ? (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="inline-flex items-center gap-1.5 bg-[#23140C] hover:bg-[#162B1D] text-[#FAF6F0] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs hover:scale-105"
                >
                  <span>{totalQtyInCart > 0 ? `${totalQtyInCart} in Cart` : 'ADD +'}</span>
                  <SlidersHorizontal className="w-3 h-3 text-[#E7C86A]" />
                </button>
              ) : cartItem && cartItem.quantity > 0 ? (
                <div className="flex items-center bg-[#162B1D] text-white rounded-full p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={handleQuickDecrease}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-black text-[#E7C86A]">
                    {cartItem.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickIncrease}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black tracking-wider transition-all shadow-xs ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#23140C] hover:bg-[#162B1D] text-[#FAF6F0] hover:scale-105'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> ADDED
                    </>
                  ) : (
                    <>
                      ADD <Plus className="w-3 h-3 text-[#E7C86A]" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      <ProductCustomizationModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={(p, qty, opts, inst) => {
          addToCart(p, qty, opts, inst);
        }}
      />
    </>
  );
}
