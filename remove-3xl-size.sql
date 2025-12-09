-- Remove 3XL size option from all products
-- Run this script to clean up existing 3XL entries in the database

-- 1. Remove 3XL stock entries
DELETE FROM product_stock 
WHERE size = '3XL';

-- 2. Verify removal
SELECT 
  product_id,
  size,
  quantity
FROM product_stock
WHERE product_id IN ('toji-sweatpants', 'vintage-cargo-pants')
ORDER BY 
  product_id,
  CASE size
    WHEN 'S' THEN 1
    WHEN 'M' THEN 2
    WHEN 'L' THEN 3
    WHEN 'XL' THEN 4
    WHEN 'XXL' THEN 5
    ELSE 6
  END;

-- 3. Show summary
SELECT 
  p.name,
  COUNT(ps.size) as available_sizes,
  string_agg(ps.size, ', ' ORDER BY 
    CASE ps.size
      WHEN 'S' THEN 1
      WHEN 'M' THEN 2
      WHEN 'L' THEN 3
      WHEN 'XL' THEN 4
      WHEN 'XXL' THEN 5
      ELSE 6
    END
  ) as sizes
FROM products p
LEFT JOIN product_stock ps ON p.id = ps.product_id
WHERE p.id IN ('toji-sweatpants', 'vintage-cargo-pants')
GROUP BY p.name
ORDER BY p.name;
