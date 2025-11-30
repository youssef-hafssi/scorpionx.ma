-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  influencer_name VARCHAR(255),
  usage_count INTEGER NOT NULL DEFAULT 0,
  max_usage INTEGER, -- NULL means unlimited
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupon_usage table to track individual uses
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_number VARCHAR(20),
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add coupon fields to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON coupon_usage(order_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample coupons
INSERT INTO coupons (code, name, discount_type, discount_value, influencer_name, is_active) VALUES
  ('WELCOME10', 'Welcome Discount', 'percentage', 10.00, NULL, true),
  ('TOJI20', 'Toji Influencer Code', 'percentage', 20.00, 'Toji', true),
  ('SUMMER15', 'Summer Sale', 'percentage', 15.00, NULL, true),
  ('FIXED50', 'Fixed 50DH Off', 'fixed', 50.00, NULL, true)
ON CONFLICT (code) DO NOTHING;
