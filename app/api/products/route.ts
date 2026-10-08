import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || undefined;
    const isBestSeller = searchParams.get('isBestSeller') === 'true' ? true : undefined;
    const vegType = (searchParams.get('vegType') as 'VEG' | 'NON_VEG') || undefined;
    const isAvailableOnly = searchParams.get('isAvailableOnly') === 'true';

    const products = await db.getProducts({
      categoryId,
      search,
      isBestSeller,
      vegType,
      isAvailableOnly,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }
    const newProduct = await db.createProduct(body);
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
