import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const products = await db.getProducts();
  return products.map((p) => ({ id: p.id }));
}

async function ProductContent({ id }: { id: string }) {
  const product = await db.getProductById(id);

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const allProducts = await db.getProducts({ categoryId: product.categoryId });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] py-16 text-center">
          <div className="max-w-md mx-auto animate-pulse space-y-4">
            <div className="h-64 bg-[#EADDCF] rounded-3xl" />
            <div className="h-8 bg-[#EADDCF] rounded-full max-w-xs mx-auto" />
          </div>
        </div>
      }
    >
      <ProductContent id={id} />
    </Suspense>
  );
}
