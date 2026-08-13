import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch every order that used a given coupon code, with customer + product details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
  }

  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, subtotal, discount_amount, total, status, created_at')
      .eq('coupon_code', code.toUpperCase())
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return NextResponse.json({ usages: [] });
    }

    const orderIds = orders.map((order) => order.id);
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('order_id, product_name, selected_size, quantity, product_price')
      .in('order_id', orderIds);

    if (itemsError) throw itemsError;

    const usages = orders.map((order) => ({
      orderId: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      status: order.status,
      subtotal: order.subtotal,
      discountAmount: order.discount_amount || 0,
      totalAfterDiscount: order.total,
      createdAt: order.created_at,
      items: (items || [])
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          productName: item.product_name,
          size: item.selected_size,
          quantity: item.quantity,
          price: item.product_price,
        })),
    }));

    return NextResponse.json({ usages });
  } catch (error) {
    console.error('Error fetching coupon usage details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupon usage details' },
      { status: 500 }
    );
  }
}
