import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.getDeliverySettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching delivery settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch delivery settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await db.updateDeliverySettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating delivery settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update delivery settings' }, { status: 500 });
  }
}
