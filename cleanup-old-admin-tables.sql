-- Cleanup Old Admin Authentication Tables
-- Run this in Supabase SQL Editor (OPTIONAL)

-- This will delete the old admin_users and admin_sessions tables
-- Only run this if you want to completely remove the old system

-- Step 1: Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_users', 'admin_sessions');

-- Step 2: Drop the tables (CASCADE will also drop related objects)
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Step 3: Verify deletion
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_users', 'admin_sessions');

-- Expected result: No rows (tables deleted successfully)
