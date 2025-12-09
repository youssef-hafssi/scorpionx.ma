-- Clean Admin Authentication System with Supabase
-- Run this in Supabase SQL Editor

-- Step 1: Drop old tables if they exist
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Step 2: Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create admin_sessions table
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Step 5: Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies (allow all for now - auth handled in app)
CREATE POLICY "Allow all operations on admin_users" 
  ON admin_users FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on admin_sessions" 
  ON admin_sessions FOR ALL 
  USING (true);

-- Step 7: Insert admin users
-- Admin 1:
--   Email: admin@scorpion.ma
--   Password: hafssi123
--   Hash: $2b$10$JEPe.ZaZIXgqSAWZGP1Ul.7/WeGQqxt/CCFBwGJZ1UwJMI8d.QV96
-- Admin 2:
--   Email: adminscorpion@scorpionx.com
--   Password: admin123
--   Hash: $2b$10$c22mFE.jifRESJ0gfEIs0eEDjKJcRgLlV.7TRwI.sw9OvCCGY.dWq

INSERT INTO admin_users (email, password_hash, name, role, is_active) 
VALUES 
  (
    'admin@scorpion.ma',
    '$2b$10$JEPe.ZaZIXgqSAWZGP1Ul.7/WeGQqxt/CCFBwGJZ1UwJMI8d.QV96',
    'Admin Scorpion',
    'super_admin',
    true
  ),
  (
    'adminscorpion@scorpionx.com',
    '$2b$10$c22mFE.jifRESJ0gfEIs0eEDjKJcRgLlV.7TRwI.sw9OvCCGY.dWq',
    'ScorpionX Admin',
    'super_admin',
    true
  );

-- Step 8: Verify the admin user was created
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  LEFT(password_hash, 20) as hash_preview,
  created_at
FROM admin_users;

-- Expected output:
-- email: admin@scorpion.ma
-- name: Admin Scorpion
-- role: super_admin
-- is_active: true
-- hash_preview: $2b$10$JEPe.ZaZIXg

-- Step 9: Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can run this periodically: SELECT cleanup_expired_sessions();
