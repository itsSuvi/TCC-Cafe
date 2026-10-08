'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { Layers, Plus, Trash2, Edit2, X, Sparkles } from 'lucide-react';

export default function CategoriesManagerClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    order: 1,
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: 'Handcrafted artisan selection.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      description: c.description || '',
      image: c.image || '',
      order: c.order,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      order: Number(formData.order),
    };

    try {
      let res;
      if (editingCategory) {
        res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        alert('Failed to save category');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
            Menu Hierarchy
          </span>
          <h1 className="font-serif text-3xl font-black text-[#23140C]">
            Category Sections ({categories.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-[#E7C86A]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-[#EADDCF] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-400">
                  Priority: #{cat.order}
                </span>
                <span className="text-xs bg-[#FAF6F0] text-[#8B5E34] font-bold px-2.5 py-1 rounded-full border border-[#EADDCF]">
                  {cat.itemCount || 0} items
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#23140C]">
                {cat.name}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EADDCF] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="p-2 rounded-xl border border-[#EADDCF] hover:bg-stone-50 text-stone-700"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 rounded-xl border border-[#EADDCF] hover:bg-red-50 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EADDCF] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADDCF]">
              <h3 className="font-serif text-lg font-bold text-[#23140C]">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Signature Desserts"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Display Order Priority
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#EADDCF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EADDCF] text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#23140C] text-[#FFFDF9] font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
