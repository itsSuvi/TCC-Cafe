'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Category, Product } from '@/lib/types';
import VegBadge from '@/components/common/VegBadge';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Flame,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';

export default function ProductsManagerClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat-desserts',
    price: 99,
    vegType: 'VEG' as 'VEG' | 'NON_VEG',
    image: '',
    description: '',
    prepTimeMinutes: 15,
    isBestSeller: false,
    isAvailable: true,
  });

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.products || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCategories(cData.categories || []);
      }
    } catch (err) {
      console.error('Failed to load catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'cat-desserts',
      price: 99,
      vegType: 'VEG',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      description: 'Freshly baked specialty with premium ingredients.',
      prepTimeMinutes: 15,
      isBestSeller: false,
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      vegType: product.vegType,
      image: product.image,
      description: product.description,
      prepTimeMinutes: product.prepTimeMinutes || 15,
      isBestSeller: !!product.isBestSeller,
      isAvailable: product.isAvailable,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const payload = {
      ...formData,
      categoryName: cat?.name || 'Bakery',
      price: Number(formData.price),
      prepTimeMinutes: Number(formData.prepTimeMinutes),
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p))
        );
      }
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from menu?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      alert('Error deleting item');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-black text-[#23140C]">
            Menu Products & Pricing ({products.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#E7C86A]" />
          <span>Add New Bakery Item</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EADDCF] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#EADDCF] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-[#FAF6F0] border border-[#EADDCF] rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-[#EADDCF] p-6 h-48 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EADDCF] text-center space-y-3">
          <Package className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#23140C]">
            No products found
          </h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search query or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-3xl border transition-all flex flex-col justify-between shadow-sm overflow-hidden ${
                product.isAvailable ? 'border-[#EADDCF]' : 'border-stone-200 opacity-60'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-[#FAF6F0]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <VegBadge vegType={product.vegType} size="sm" showLabel />
                    {product.isBestSeller && (
                      <span className="bg-amber-500 text-[#23140C] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <Flame className="w-3 h-3 fill-[#23140C]" /> Best Seller
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(product)}
                      className={`text-xs font-bold px-3 py-1 rounded-full shadow-md transition-colors ${
                        product.isAvailable
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {product.isAvailable ? 'In Stock ✓' : 'Sold Out ✕'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E34]">
                    {product.categoryName || 'Bakery Item'}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#23140C] leading-snug">
                      {product.name}
                    </h3>
                    <span className="font-serif font-black text-lg text-[#23140C] shrink-0">
                      ₹{product.price}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Actions Bottom Bar */}
              <div className="p-4 bg-[#FAF6F0] border-t border-[#EADDCF] flex items-center justify-between">
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8B5E34]" />
                  {product.prepTimeMinutes || 15} mins prep
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(product)}
                    className="p-2 rounded-xl bg-white border border-[#EADDCF] text-stone-700 hover:text-[#23140C] hover:bg-stone-50 transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="p-2 rounded-xl bg-white border border-[#EADDCF] text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EADDCF] max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADDCF]">
              <h3 className="font-serif text-xl font-bold text-[#23140C]">
                {editingProduct ? 'Edit Bakery Item' : 'Add New Bakery Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Triple Chocolate Waffle"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EADDCF] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Dietary Type
                  </label>
                  <select
                    value={formData.vegType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vegType: e.target.value as 'VEG' | 'NON_VEG',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EADDCF] bg-white"
                  >
                    <option value="VEG">100% Vegetarian (Pure Veg)</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Prep Time (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.prepTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prepTimeMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Artisan description of ingredients and flavors..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) =>
                      setFormData({ ...formData, isBestSeller: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#C89B2B] focus:ring-[#C89B2B]"
                  />
                  <span className="font-bold text-xs text-stone-800">
                    Mark as Best Seller
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({ ...formData, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#C89B2B] focus:ring-[#C89B2B]"
                  />
                  <span className="font-bold text-xs text-stone-800">
                    In Stock Available
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EADDCF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#EADDCF] text-stone-700 font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#23140C] text-[#FFFDF9] hover:bg-[#3B2416] font-bold shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
