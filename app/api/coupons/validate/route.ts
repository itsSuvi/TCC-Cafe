import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const result = await db.validateCoupon(code, Number(subtotal || 0));
    return NextResponse.json({ success: result.isValid, ...result });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
