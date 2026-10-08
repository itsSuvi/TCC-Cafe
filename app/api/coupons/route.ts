import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.getCoupons();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ success: false, error: 'Code and discountValue are required' }, { status: 400 });
    }
    const coupon = await db.createCoupon(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
  }
}
