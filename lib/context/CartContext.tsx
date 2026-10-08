'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartItemOption, DeliveryAddress, OrderType, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  couponCode: string;
  discount: number;
  couponMessage: string;
  appliedCoupon: any;
  deliveryAddress: DeliveryAddress | null;
  setDeliveryAddress: (address: DeliveryAddress | null) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    options?: CartItemOption[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'the_classic_crush_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
      }
    } catch (e) {
      console.warn('Failed to parse cart storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          items,
          orderType,
          deliveryAddress,
        })
      );
    } catch (e) {
      console.warn('Failed to persist cart storage', e);
    }
  }, [items, orderType, deliveryAddress, isLoaded]);

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Recalculate coupon if subtotal changes
  useEffect(() => {
    if (!couponCode || subtotal === 0) {
      setDiscount(0);
      return;
    }
    // Re-verify coupon
    fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, subtotal }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setDiscount(res.discount);
          setCouponMessage(res.message);
          setAppliedCoupon(res.coupon);
        } else {
          setDiscount(0);
          setCouponMessage(res.message);
        }
      })
      .catch(() => {});
  }, [subtotal, couponCode]);

  const addToCart = (
    product: Product,
    quantity = 1,
    options: CartItemOption[] = [],
    specialInstructions = ''
  ) => {
    const sortedOptions = [...options].sort((a, b) => a.optionId.localeCompare(b.optionId));
    const optionKey = sortedOptions.map((o) => o.optionId).join('-');
    const lineId = `${product.id}_${optionKey || 'base'}`;

    let extraPrice = 0;
    options.forEach((opt) => {
      extraPrice += Number(opt.price || 0);
    });
    const unitPrice = product.price + extraPrice;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === lineId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: lineId,
          productId: product.id,
          product,
          quantity,
          selectedOptions: options,
          specialInstructions,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a coupon code' };

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode(clean);
        setDiscount(data.discount);
        setCouponMessage(data.message);
        setAppliedCoupon(data.coupon);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        orderType,
        setOrderType,
        couponCode,
        discount,
        couponMessage,
        appliedCoupon,
        deliveryAddress,
        setDeliveryAddress,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
