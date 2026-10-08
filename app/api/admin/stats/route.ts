import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = await db.getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to load statistics' }, { status: 500 });
  }
}
