import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all coupons or validate a specific coupon
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const validateOnly = searchParams.get('validate') === 'true';

  try {
    if (code && validateOnly) {
      // Validate a specific coupon code
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        return NextResponse.json(
          { valid: false, message: 'Invalid coupon code' },
          { status: 404 }
        );
      }

      // Check if expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json(
          { valid: false, message: 'This coupon has expired' },
          { status: 400 }
        );
      }

      // Check usage limit
      if (coupon.max_usage && coupon.usage_count >= coupon.max_usage) {
        return NextResponse.json(
          { valid: false, message: 'This coupon has reached its usage limit' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          name: coupon.name,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          influencer_name: coupon.influencer_name
        }
      });
    }

    // Fetch all coupons (for admin)
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST - Create a new coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, discount_type, discount_value, influencer_name, max_usage, expires_at } = body;

    // Validate required fields
    if (!code || !name || !discount_type || !discount_value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        code: code.toUpperCase(),
        name,
        discount_type,
        discount_value: parseFloat(discount_value),
        influencer_name: influencer_name || null,
        max_usage: max_usage || null,
        expires_at: expires_at || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

// PATCH - Update a coupon
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    // If code is being updated, make it uppercase
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a coupon
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
