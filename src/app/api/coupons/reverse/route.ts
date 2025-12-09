import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Reverse coupon usage (for cancelled orders that were delivered)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, orderId, orderNumber } = body;

    if (!couponCode) {
      return NextResponse.json(
        { error: 'Missing coupon code' },
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

    // Check if there's a usage record for this order
    const { data: usageRecord, error: usageError } = await supabase
      .from('coupon_usage')
      .select('*')
      .eq('coupon_id', coupon.id)
      .eq('order_id', orderId)
      .single();

    if (usageError || !usageRecord) {
      console.log('No usage record found to reverse for order:', orderNumber);
      return NextResponse.json({ 
        success: true, 
        message: 'No usage record found to reverse' 
      });
    }

    // Delete the usage record
    const { error: deleteError } = await supabase
      .from('coupon_usage')
      .delete()
      .eq('id', usageRecord.id);

    if (deleteError) {
      console.error('Error deleting coupon usage record:', deleteError);
      throw new Error('Failed to delete usage record');
    }

    // Decrease usage count (but don't go below 0)
    const newUsageCount = Math.max(0, coupon.usage_count - 1);
    const { error: updateError } = await supabase
      .from('coupons')
      .update({ 
        usage_count: newUsageCount 
      })
      .eq('id', coupon.id);

    if (updateError) {
      console.error('Error updating coupon usage count:', updateError);
      throw new Error('Failed to update coupon usage count');
    }

    console.log(`Reversed coupon usage for ${couponCode}, new count: ${newUsageCount}`);

    return NextResponse.json({ 
      success: true,
      message: 'Coupon usage successfully reversed',
      newUsageCount
    });
  } catch (error) {
    console.error('Error in coupon usage reversal:', error);
    return NextResponse.json(
      { error: 'Failed to reverse coupon usage' },
      { status: 500 }
    );
  }
}