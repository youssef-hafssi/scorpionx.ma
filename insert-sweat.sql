-- Insert SCORPIONX TRACK PANTS Product into Supabase Database
-- Run this in your Supabase SQL Editor

-- ============================================
-- SCORPIONX TRACK PANTS PRODUCT
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'sweat',
  'SCORPIONX TRACK PANTS',
  'Premium quality track pants designed for comfort and style. Perfect for everyday wear.

• Fit: Baggy / Comfortable
• Style: Track Pants
• Use: Multi-purpose (Basic / Streetwear / Casual)
• Comfort: Soft fabric with natural stretch for all-day wear
• Waist: Elastic waistband with drawstring for adjustable fit
• Care: Machine wash cold – Do not bleach – Iron low
• Gender: Unisex',
  270,
  350,
  ''
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  updated_at = NOW();

-- Insert stock for SCORPIONX TRACK PANTS (sizes: S, M, L, XL)
-- Starting with moderate stock levels
INSERT INTO product_stock (product_id, size, quantity, low_stock_threshold) VALUES
('sweat', 'S', 20, 5),
('sweat', 'M', 25, 5),
('sweat', 'L', 30, 5),
('sweat', 'XL', 25, 5)
ON CONFLICT (product_id, size) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  updated_at = NOW();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify the product insertion
SELECT 
  p.id,
  p.name,
  p.price,
  p.original_price,
  p.image,
  COUNT(ps.id) as size_variants,
  SUM(ps.quantity) as total_stock
FROM products p
LEFT JOIN product_stock ps ON p.id = ps.product_id
WHERE p.id = 'sweat'
GROUP BY p.id, p.name, p.price, p.original_price, p.image;

-- View all stock levels for SCORPIONX TRACK PANTS
SELECT 
  product_id,
  size,
  quantity,
  low_stock_threshold,
  CASE 
    WHEN quantity = 0 THEN 'OUT OF STOCK'
    WHEN quantity <= low_stock_threshold THEN 'LOW STOCK'
    ELSE 'IN STOCK'
  END as status
FROM product_stock
WHERE product_id = 'sweat'
ORDER BY 
  CASE size 
    WHEN 'S' THEN 1 
    WHEN 'M' THEN 2 
    WHEN 'L' THEN 3 
    WHEN 'XL' THEN 4 
  END;

-- View all products in the store
SELECT id, name, price, original_price, image FROM products ORDER BY name;
