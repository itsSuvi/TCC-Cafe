import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { distanceKm, subtotal } = body;

    if (distanceKm === undefined || subtotal === undefined) {
      return NextResponse.json(
        { success: false, error: 'distanceKm and subtotal are required' },
        { status: 400 }
      );
    }

    const result = await db.calculateDeliveryFee(Number(distanceKm), Number(subtotal));
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate delivery fee' }, { status: 500 });
  }
}
