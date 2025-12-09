import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Record coupon usage and increment usage counter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, orderId, orderNumber, discountAmount } = body;

    if (!couponCode || !discountAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single();

    if (couponError || !coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if this order already has a usage record (prevent duplicates)
    if (orderId) {
      const { data: existingUsage } = await supabase
        .from('coupon_usage')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('order_id', orderId)
        .single();

      if (existingUsage) {
        return NextResponse.json({
          success: true,
          message: 'Coupon usage already recorded for this order'
        });
      }
    }

    // Verify order is delivered before counting usage
    if (orderId) {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      if (order.status !== 'Delivered') {
        return NextResponse.json(
          { error: 'Coupon can only be marked as used for delivered orders' },
          { status: 400 }
        );
      }
    }

    // Increment usage count
    const { error: updateError } = await supabase
      .from('coupons')
      .update({ 
        usage_count: coupon.usage_count + 1 
      })
      .eq('id', coupon.id);

    if (updateError) {
      console.error('Error updating coupon usage count:', updateError);
      throw new Error('Failed to update coupon usage count');
    }

    // Record the usage in coupon_usage table
    const { error: usageError } = await supabase
      .from('coupon_usage')
      .insert({
        coupon_id: coupon.id,
        order_id: orderId || null,
        order_number: orderNumber || null,
        discount_amount: parseFloat(discountAmount)
      });

    if (usageError) {
      console.error('Error recording coupon usage:', usageError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in coupon usage tracking:', error);
    return NextResponse.json(
      { error: 'Failed to track coupon usage' },
      { status: 500 }
    );
  }
}
