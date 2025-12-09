-- Add New Admin User: adminscorpion@scorpionx.com
-- Run this in Supabase SQL Editor

-- Step 1: Check existing admin users
SELECT 
  email,
  name,
  role,
  is_active,
  created_at
FROM admin_users
ORDER BY created_at DESC;

-- Step 2: Insert new admin user
-- Email: adminscorpion@scorpionx.com
-- Password: admin123
-- Hash: $2b$10$c22mFE.jifRESJ0gfEIs0eEDjKJcRgLlV.7TRwI.sw9OvCCGY.dWq
INSERT INTO admin_users (email, password_hash, name, role, is_active) 
VALUES (
  'adminscorpion@scorpionx.com',
  '$2b$10$c22mFE.jifRESJ0gfEIs0eEDjKJcRgLlV.7TRwI.sw9OvCCGY.dWq',
  'ScorpionX Admin',
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Step 3: Verify both admin users exist
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  LEFT(password_hash, 25) as hash_preview,
  created_at,
  updated_at
FROM admin_users
ORDER BY email;

-- Expected output (2 rows):
-- 1. admin@scorpion.ma (password: hafssi123)
-- 2. adminscorpion@scorpionx.com (password: admin123)

-- Step 4: Test query to verify login will work
SELECT 
  COUNT(*) as total_admins,
  SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_admins
FROM admin_users;

-- Expected: total_admins = 2, active_admins = 2
