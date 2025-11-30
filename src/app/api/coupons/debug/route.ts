import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Debug endpoint to test coupon database connection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    requestedCode: code,
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
    }
  };

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    debugInfo.connectionCreated = true;

    // Test 1: Try to fetch all coupons
    const { data: allCoupons, error: allError } = await supabase
      .from('coupons')
      .select('code, name, is_active');

    debugInfo.allCouponsQuery = {
      success: !allError,
      error: allError?.message,
      count: allCoupons?.length || 0,
      coupons: allCoupons?.map(c => ({ code: c.code, name: c.name, active: c.is_active }))
    };

    // Test 2: Try to fetch specific coupon if code provided
    if (code) {
      const { data: specificCoupon, error: specificError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      debugInfo.specificCouponQuery = {
        searchedCode: code.toUpperCase(),
        success: !specificError,
        error: specificError?.message,
        errorCode: specificError?.code,
        found: !!specificCoupon,
        coupon: specificCoupon ? {
          code: specificCoupon.code,
          name: specificCoupon.name,
          discount_type: specificCoupon.discount_type,
          discount_value: specificCoupon.discount_value,
          is_active: specificCoupon.is_active
        } : null
      };
    }

    // Test 3: Check if table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('coupons')
      .select('count')
      .limit(1);

    debugInfo.tableExists = !tableError;
    debugInfo.tableError = tableError?.message;

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error: any) {
    debugInfo.exception = {
      message: error.message,
      stack: error.stack
    };
    return NextResponse.json(debugInfo, { status: 500 });
  }
}
