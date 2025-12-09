-- Quick script to check if coupons table exists and has data
-- Run this in your Supabase SQL Editor

-- Check if the coupons table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'coupons';

-- If the table exists, check its data
SELECT * FROM coupons LIMIT 5;

-- If you see an error "relation coupons does not exist", 
-- you need to run coupon-schema.sql first!
