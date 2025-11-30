-- Insert Toji Sweatpants Product into Supabase Database
-- Run this in your Supabase SQL Editor

-- Insert the Toji Sweatpants product
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

-- Insert stock for all sizes (Toji Sweatpants)
-- Starting with moderate stock levels since it's a new product
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

-- Verify the insertion
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
WHERE p.id = 'toji-sweatpants'
GROUP BY p.id, p.name, p.price, p.original_price, p.image;

-- View all stock levels for Toji Sweatpants
SELECT 
  product_id,
  size,
  quantity,
  low_stock_threshold,
  CASE 
    WHEN quantity = 0 THEN 'OUT OF STOCK'
    WHEN quantity <= low_stock_threshold THEN 'LOW STOCK'
    ELSE 'IN STOCK'
  END as stock_status
FROM product_stock
WHERE product_id = 'toji-sweatpants'
ORDER BY   CASE size
    WHEN 'S' THEN 1
    WHEN 'M' THEN 2
    WHEN 'L' THEN 3
    WHEN 'XL' THEN 4
    WHEN 'XXL' THEN 5
    ELSE 6
  END;
