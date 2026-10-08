import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }
    const profile = await db.getUserProfile(phone);
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, action, address, productId } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    if (action === 'save-address' && address) {
      const updated = await db.saveUserAddress(phone, address);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'toggle-favorite' && productId) {
      const favorites = await db.toggleFavorite(phone, productId);
      return NextResponse.json({ success: true, data: favorites });
    }

    const profile = await db.getUserProfile(phone);
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user profile' }, { status: 500 });
  }
}
