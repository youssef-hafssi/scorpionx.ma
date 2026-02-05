-- Bundle Pricing SQL for Track Pants + Track Sweater Bundle
-- Bundle Price: 475 DH (saves 45 DH compared to buying separately: 270 + 250 = 520 DH)

-- Create bundles table if not exists
CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  bundle_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle_products table to link products to bundles
CREATE TABLE IF NOT EXISTS bundle_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- References product id (e.g., 'sweat', 'track-sweater')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the Track Pants + Track Sweater bundle
INSERT INTO bundles (name, description, bundle_price, is_active)
VALUES (
  'Track Pants + Track Sweater Bundle',
  'Get both the SCORPIONX Track Pants and Track Sweater together at a special bundle price! Save 45 DH compared to buying separately.',
  475.00,
  true
) ON CONFLICT DO NOTHING;

-- Get the bundle ID and insert products
-- Note: Run this after the bundle is created
DO $$
DECLARE
  bundle_uuid UUID;
BEGIN
  -- Get the bundle ID
  SELECT id INTO bundle_uuid FROM bundles WHERE name = 'Track Pants + Track Sweater Bundle' LIMIT 1;
  
  -- Insert Track Pants into bundle
  INSERT INTO bundle_products (bundle_id, product_id)
  VALUES (bundle_uuid, 'sweat')
  ON CONFLICT DO NOTHING;
  
  -- Insert Track Sweater into bundle
  INSERT INTO bundle_products (bundle_id, product_id)
  VALUES (bundle_uuid, 'track-sweater')
  ON CONFLICT DO NOTHING;
END $$;

-- Optional: Create an index for faster bundle lookups
CREATE INDEX IF NOT EXISTS idx_bundle_products_bundle_id ON bundle_products(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_products_product_id ON bundle_products(product_id);

-- View bundle with products
-- SELECT b.*, bp.product_id
-- FROM bundles b
-- JOIN bundle_products bp ON b.id = bp.bundle_id
-- WHERE b.is_active = true;

/*
PRICING SUMMARY:
===============
Individual Prices:
- Track Pants: 270 DH
- Track Sweater: 250 DH
- Total if bought separately: 520 DH

Bundle Price:
- Both together: 475 DH
- Savings: 45 DH (8.6% discount)

Note: This SQL creates the database structure for bundles.
The actual bundle pricing logic is handled in the FrequentlyBoughtTogether component
at src/components/frequently-bought-together.tsx with BUNDLE_PRICE = 475
*/
