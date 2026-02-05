-- Insert SCORPIONX TRACK SWEATER Product into Supabase Database
-- Run this in your Supabase SQL Editor

-- ============================================
-- SCORPIONX TRACK SWEATER PRODUCT
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'track-sweater',
  'SCORPIONX TRACK SWEATER',
  'Premium cropped zip-up hoodie designed for comfort and style. Perfect for everyday wear.

• Fit: Baggy / Comfortable
• Style: Cropped Zip-Up Hoodie
• Use: Multi-purpose (Basic / Streetwear / Casual)
• Comfort: Soft fabric with natural stretch for all-day wear
• Care: Machine wash cold – Do not bleach – Iron low
• Gender: Unisex',
  250,
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

-- Insert stock for SCORPIONX TRACK SWEATER (sizes: S, M, L, XL)
-- Starting with moderate stock levels
INSERT INTO product_stock (product_id, size, quantity, low_stock_threshold) VALUES
('track-sweater', 'S', 20, 5),
('track-sweater', 'M', 25, 5),
('track-sweater', 'L', 30, 5),
('track-sweater', 'XL', 25, 5)
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
WHERE p.id = 'track-sweater'
GROUP BY p.id, p.name, p.price, p.original_price, p.image;

-- View all stock levels for SCORPIONX TRACK SWEATER
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
WHERE product_id = 'track-sweater'
ORDER BY 
  CASE size 
    WHEN 'S' THEN 1 
    WHEN 'M' THEN 2 
    WHEN 'L' THEN 3 
    WHEN 'XL' THEN 4 
  END;

-- View all products in the store
SELECT id, name, price, original_price, image FROM products ORDER BY name;
