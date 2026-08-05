-- Insert All Products into Supabase Database
-- Run this in your Supabase SQL Editor
-- This file contains all products for the ScorpionX store

-- ============================================
-- 1. AWRAH COVER (Vintage Cargo Pants)
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'vintage-cargo-pants',
  'ساتر العورة (Awrah Cover)',
  'في عالمٍ تتغيّر فيه مفاهيم اللباس، يأتي "سكوربيون إكس" ليقدّم "ساتر العورة" ويُعيد تعريف الأناقة الرجالية من منظورٍ واعٍ ومحترم. هذا التصميم صُمم خصيصًا للرجل الذي يعتزّ بهويته، ويحرص على الالتزام بالستر والوقار دون أن يتخلى عن الذوق الرفيع.',
  220,
  250,
  '/pc1.jpg'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  updated_at = NOW();

-- Insert stock for Awrah Cover (all sizes)
INSERT INTO product_stock (product_id, size, quantity, low_stock_threshold) VALUES
('vintage-cargo-pants', 'S', 25, 5),
('vintage-cargo-pants', 'M', 30, 5),
('vintage-cargo-pants', 'L', 35, 5),
('vintage-cargo-pants', 'XL', 20, 5),
('vintage-cargo-pants', 'XXL', 15, 5)
ON CONFLICT (product_id, size) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  updated_at = NOW();

-- ============================================
-- 2. TOJI SWEATPANTS
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'toji-sweatpants',
  'Toji Sweatpants',
  'Premium streetwear comfort meets Islamic modesty. The ultimate sweatpants designed for brothers who value both style and faith. Crafted with high-quality cotton blend for maximum comfort while maintaining a loose, modest fit that adheres to Islamic guidelines.',
  250,
  320,
  '/34.jpeg'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  updated_at = NOW();

-- Insert stock for Toji Sweatpants (all sizes)
INSERT INTO product_stock (product_id, size, quantity, low_stock_threshold) VALUES
('toji-sweatpants', 'S', 20, 5),
('toji-sweatpants', 'M', 25, 5),
('toji-sweatpants', 'L', 30, 5),
('toji-sweatpants', 'XL', 25, 5),
('toji-sweatpants', 'XXL', 15, 5)
ON CONFLICT (product_id, size) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  updated_at = NOW();

-- ============================================
-- 3. AWRAH OVER LEGGINGS
-- ============================================
INSERT INTO products (id, name, description, price, original_price, image) VALUES
(
  'awrah-cover-leggings',
  'Awrah Cover Leggings',
  'Modest coverage leggings designed to be worn under shorts or a thobe. Soft, stretchy fabric with an elastic waistband for a secure, comfortable fit during sport, prayer, or everyday wear.',
  140,
  140,
  '/leggings1.jpeg'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  updated_at = NOW();

-- Insert stock for Awrah Cover Leggings (grouped sizes)
INSERT INTO product_stock (product_id, size, quantity, low_stock_threshold) VALUES
('awrah-cover-leggings', 'XS-S', 20, 5),
('awrah-cover-leggings', 'M-L', 25, 5),
('awrah-cover-leggings', 'XL-XXL', 15, 5)
ON CONFLICT (product_id, size) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  updated_at = NOW();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- View all products with total stock
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
GROUP BY p.id, p.name, p.price, p.original_price, p.image
ORDER BY p.created_at DESC;

-- View all stock levels (organized by product and size)
SELECT 
  p.name as product_name,
  ps.size,
  ps.quantity,
  ps.low_stock_threshold,
  CASE 
    WHEN ps.quantity = 0 THEN '🔴 OUT OF STOCK'
    WHEN ps.quantity <= ps.low_stock_threshold THEN '🟡 LOW STOCK'
    ELSE '🟢 IN STOCK'
  END as stock_status
FROM products p
JOIN product_stock ps ON p.id = ps.product_id
ORDER BY 
  p.name,
  CASE ps.size
    WHEN 'S' THEN 1
    WHEN 'M' THEN 2
    WHEN 'L' THEN 3    WHEN 'XL' THEN 4
    WHEN 'XXL' THEN 5
    ELSE 6
  END;

-- Summary by product
SELECT 
  p.name,
  SUM(ps.quantity) as total_stock,
  MIN(ps.quantity) as min_size_stock,
  MAX(ps.quantity) as max_size_stock,
  ROUND(AVG(ps.quantity), 2) as avg_size_stock
FROM products p
JOIN product_stock ps ON p.id = ps.product_id
GROUP BY p.id, p.name
ORDER BY p.name;
