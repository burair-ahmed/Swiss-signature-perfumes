import { NextResponse } from 'next/server';
import { getStoredProducts } from '@/lib/orders-store';

export async function GET() {
  try {
    const products = getStoredProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
