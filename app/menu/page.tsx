import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import MenuClient from './MenuClient';

export default async function MenuPage() {
  const categories = await db.getCategories();
  const products = await db.getProducts();

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#5A3922]">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#EADDCF] rounded-full max-w-sm mx-auto" />
            <div className="h-12 bg-[#EADDCF] rounded-2xl max-w-xl mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 bg-[#EADDCF]/60 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <MenuClient initialCategories={categories} initialProducts={products} />
    </Suspense>
  );
}
