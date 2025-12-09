-- Update Toji Sweatpants product image to 34.jpeg
-- Run this in your Supabase SQL Editor

UPDATE products 
SET image = '/34.jpeg',
    updated_at = NOW()
WHERE id = 'toji-sweatpants';

-- Verify the update
SELECT id, name, image, updated_at 
FROM products 
WHERE id = 'toji-sweatpants';
