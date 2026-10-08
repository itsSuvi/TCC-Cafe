import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = await db.getReviews(productId);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productName, userName, rating, comment } = body;

    if (!productId || !userName || !rating) {
      return NextResponse.json(
        { success: false, error: 'productId, userName, and rating are required' },
        { status: 400 }
      );
    }

    const newReview = await db.createReview({
      productId,
      productName: productName || 'Delicacy',
      userName,
      rating: Number(rating),
      comment: comment || '',
      verifiedPurchase: true,
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}
