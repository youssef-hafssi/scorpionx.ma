-- Update Toji Sweatpants price and image in the database
-- Run this in your Supabase SQL Editor

UPDATE products 
SET 
  price = 250,
  image = '/34.jpeg',
  updated_at = NOW()
WHERE id = 'toji-sweatpants';

-- Verify the update
SELECT id, name, price, original_price, image, updated_at 
FROM products 
WHERE id = 'toji-sweatpants';
