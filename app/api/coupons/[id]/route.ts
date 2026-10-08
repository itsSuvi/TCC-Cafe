import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updated = await db.toggleCouponStatus(id);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await db.deleteCoupon(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}
