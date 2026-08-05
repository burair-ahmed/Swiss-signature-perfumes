import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Process order calculation
    const orderId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created successfully',
      paymentMethod,
      customerEmail: customer?.email,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
