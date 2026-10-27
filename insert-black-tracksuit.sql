-- Insert SCORPIONX TRACK PANTS BLACK + SCORPIONX ZIPUP HOODIE BLACK into Supabase Database
-- Run this in your Supabase SQL Editor
-- Adjust the stock quantities below to your real inventory before running.

-- ============================================
-- SCORPIONX TRACK PANTS BLACK
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'track-pants-black',
  'SCORPIONX TRACK PANTS BLACK',
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
  '/bkp.jpeg'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  updated_at = NOW();

-- ============================================
-- SCORPIONX ZIPUP HOODIE BLACK
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'zipup-hoodie-black',
  'SCORPIONX ZIPUP HOODIE BLACK',
  'Premium quality cropped zip-up hoodie designed for comfort and style.

• Fit: Baggy / Comfortable
• Style: Cropped Zip-Up Hoodie
• Use: Multi-purpose (Basic / Streetwear / Casual)
• Comfort: Soft fabric with natural stretch for all-day wear
• Care: Machine wash cold – Do not bleach – Iron low
• Gender: Unisex',
  250,
  350,
  '/bk2.jpeg'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  updated_at = NOW();

-- ============================================
-- STOCK (sizes: M, L, XL)
-- ============================================
INSERT INTO product_stock (product_id, size, quantity, low_stock_threshold) VALUES
('track-pants-black', 'M', 25, 5),
('track-pants-black', 'L', 30, 5),
('track-pants-black', 'XL', 25, 5),
('zipup-hoodie-black', 'M', 25, 5),
('zipup-hoodie-black', 'L', 30, 5),
('zipup-hoodie-black', 'XL', 25, 5)
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
WHERE p.id IN ('track-pants-black', 'zipup-hoodie-black')
GROUP BY p.id, p.name, p.price, p.original_price, p.image;

-- View all stock levels for the black tracksuit
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
WHERE product_id IN ('track-pants-black', 'zipup-hoodie-black')
ORDER BY
  product_id,
  CASE size
    WHEN 'M' THEN 1
    WHEN 'L' THEN 2
    WHEN 'XL' THEN 3
  END;
