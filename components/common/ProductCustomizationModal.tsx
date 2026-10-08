'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, CartItemOption } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import VegBadge from './VegBadge';
import { X, Plus, Minus, Sparkles, Check } from 'lucide-react';

interface ProductCustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedOptions: CartItemOption[],
    specialInstructions: string
  ) => void;
}

export default function ProductCustomizationModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  // Initialize defaults when product opens
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSpecialInstructions('');
      const defaultOpts: CartItemOption[] = [];

      // If there are radio groups, select the first default option
      if (product.customizations) {
        for (const group of product.customizations) {
          if (group.type === 'radio' && group.options.length > 0) {
            defaultOpts.push({
              groupId: group.id,
              groupTitle: group.title,
              optionId: group.options[0].id,
              optionName: group.options[0].name,
              price: group.options[0].price,
            });
          }
        }
      }
      setSelectedOptions(defaultOpts);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Calculate dynamic unit price
  let extraCost = 0;
  selectedOptions.forEach((opt) => {
    extraCost += Number(opt.price || 0);
  });
  const unitPrice = Math.max(0, product.price + extraCost);
  const totalPrice = unitPrice * quantity;

  const handleRadioSelect = (group: any, option: any) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((o) => o.groupId !== group.id);
      return [
        ...filtered,
        {
          groupId: group.id,
          groupTitle: group.title,
          optionId: option.id,
          optionName: option.name,
          price: option.price,
        },
      ];
    });
  };

  const handleCheckboxToggle = (group: any, option: any) => {
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
            optionId: option.id,
            optionName: option.name,
            price: option.price,
          },
        ];
      }
    });
  };

  const handleSubmit = () => {
    setIsAddedAnimation(true);
    setTimeout(() => {
      onAddToCart(product, quantity, selectedOptions, specialInstructions);
      setIsAddedAnimation(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-[#FAF6F0] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EADDCF] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with close button */}
        <div className="relative h-48 sm:h-56 w-full bg-[#23140C]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#23140C] p-2 rounded-full shadow-md transition-transform hover:scale-105"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <VegBadge vegType={product.vegType} size="md" />
              {product.isBestSeller && (
                <span className="bg-[#C89B2B] text-[#23140C] text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Best Seller
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl font-bold leading-tight">{product.name}</h3>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{product.description}</p>
          </div>
        </div>

        {/* Modal Body: Customization Groups */}
        <div className="p-5 max-h-[55vh] overflow-y-auto space-y-6">
          {product.customizations && product.customizations.length > 0 ? (
            product.customizations.map((group) => (
              <div key={group.id} className="space-y-2.5 pb-4 border-b border-[#EADDCF]/70">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#23140C]">{group.title}</h4>
                  <span className="text-[11px] font-medium text-[#6B635B] bg-[#F4ECE1] px-2 py-0.5 rounded-md">
                    {group.type === 'radio' ? 'Select 1 option' : 'Optional extras'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = selectedOptions.some((o) => o.optionId === option.id);
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#162B1D]/5 border-[#162B1D] text-[#162B1D] font-medium shadow-2xs'
                            : 'bg-white border-[#EADDCF] hover:bg-[#F4ECE1]/50 text-[#3B2416]'
                        }`}
                        onClick={() => {
                          if (group.type === 'radio') {
                            handleRadioSelect(group, option);
                          } else {
                            handleCheckboxToggle(group, option);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type={group.type === 'radio' ? 'radio' : 'checkbox'}
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#162B1D] accent-[#162B1D] cursor-pointer"
                          />
                          <span className="text-sm">{option.name}</span>
                        </div>
                        {option.price > 0 && (
                          <span className="text-xs font-bold text-[#C89B2B]">
                            +{formatCurrency(option.price)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#F4ECE1] p-3 rounded-xl text-xs text-[#5A3922]">
              ✨ Freshly handcrafted to order using authentic high quality ingredients.
            </div>
          )}

          {/* Special Cooking / Baking Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#23140C] uppercase tracking-wider block">
              Special Instructions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Less sweet, extra hot, no onions, special occasion note..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#EADDCF] bg-white text-[#23140C] focus:outline-hidden focus:ring-2 focus:ring-[#C89B2B] resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F4ECE1] border-t border-[#EADDCF] flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white rounded-full border border-[#EADDCF] p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#23140C] hover:bg-[#F4ECE1] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-black text-[#23140C]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#23140C] hover:bg-[#F4ECE1] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-[#23140C] hover:bg-[#162B1D] text-[#FAF6F0] py-3 px-5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-between hover:scale-[1.02]"
          >
            <span>{isAddedAnimation ? 'Adding...' : 'Add to Order'}</span>
            <span className="font-black text-[#E7C86A]">{formatCurrency(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
