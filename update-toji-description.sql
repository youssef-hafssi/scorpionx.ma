-- Update Toji Sweatpants Description with detailed product information
-- Run this in your Supabase SQL Editor

UPDATE products
SET 
  description = 'Made for Those who mix comfort, power & style

• Material: 70% Cotton / 30% Polyester
• Fit: Regular / Comfortable
• Style: Suit Pants – inspired by Toji''s look
• Use: Multi-purpose (Gym / Streetwear / Casual)
• Comfort: Soft fabric with natural stretch for all-day wear
• Waist: Elastic waistband with drawstring for adjustable fit
• Care: Machine wash cold – Do not bleach – Iron low
• Gender: Unisex

Premium streetwear comfort meets Islamic modesty. The ultimate sweatpants designed for brothers who value both style and faith. These versatile pants are perfect for the gym, casual outings, or everyday wear while maintaining a loose, modest fit that adheres to Islamic guidelines.',
  updated_at = NOW()
WHERE id = 'toji-sweatpants';

-- Verify the update
SELECT 
  id,
  name,
  description,
  price,
  original_price,
  updated_at
FROM products
WHERE id = 'toji-sweatpants';
