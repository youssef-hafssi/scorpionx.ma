-- Test script to verify coupon system is working
-- Run this in Supabase SQL Editor to check everything

-- 1. Check if coupons table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'coupons'
) as coupons_table_exists;

-- 2. Check if coupon_usage table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'coupon_usage'
) as coupon_usage_table_exists;

-- 3. Check if orders table has coupon columns
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('coupon_code', 'discount_amount');

-- 4. List all coupons in the database
SELECT 
    code,
    name,
    discount_type,
    discount_value,
    influencer_name,
    usage_count,
    max_usage,
    is_active,
    expires_at,
    created_at
FROM coupons
ORDER BY created_at DESC;

-- 5. Count total coupons
SELECT COUNT(*) as total_coupons FROM coupons;

-- 6. Count active coupons
SELECT COUNT(*) as active_coupons 
FROM coupons 
WHERE is_active = true;

-- 7. Test specific coupon lookup (like the API does)
SELECT 
    id,
    code,
    name,
    discount_type,
    discount_value,
    influencer_name,
    is_active
FROM coupons
WHERE code = 'HAFSSI'
AND is_active = true;

-- 8. List all coupon codes
SELECT code, name, is_active 
FROM coupons
ORDER BY code;
