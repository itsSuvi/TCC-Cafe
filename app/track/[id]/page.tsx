import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import TrackOrderClient from './TrackOrderClient';

interface TrackPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const orders = await db.getOrders({ limit: 10 });
  return orders.map((o) => ({ id: o.id }));
}

async function TrackContent({ id }: { id: string }) {
  const order = await db.getOrderById(id);

  if (!order) {
    notFound();
  }

  return <TrackOrderClient initialOrder={order} />;
}

export default async function TrackOrderPage({ params }: TrackPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] py-16 text-center">
          <div className="max-w-md mx-auto animate-pulse space-y-4">
            <div className="h-40 bg-[#EADDCF] rounded-3xl" />
            <div className="h-8 bg-[#EADDCF] rounded-full max-w-xs mx-auto" />
          </div>
        </div>
      }
    >
      <TrackContent id={id} />
    </Suspense>
  );
}
