# 🔧 Fix: Hydration Error & Coupon 404 Issues

## Issues Identified

### ❌ Issue 1: Hydration Error
```
In HTML, whitespace text nodes cannot be a child of <html>
```

### ❌ Issue 2: Coupon API 404 Error
```
api/coupons?code=HAFSSI&validate=true:1 Failed to load resource: 404
```

---

## ✅ Solutions Applied

### Fix 1: Hydration Error - FIXED ✓

**Problem:** Extra whitespace between `<html>` and `<body>` tags in `layout.tsx`

**Before:**
```tsx
<html lang="en">      <body
  className="antialiased sf-mono-font"
>
```

**After:**
```tsx
<html lang="en">
  <body className="antialiased sf-mono-font">
```

**Status:** ✅ **FIXED** - The layout has been cleaned up

---

### Fix 2: Coupon API 404 Error

**Problem:** The `coupons` table doesn't exist in your Supabase database yet.

**Root Cause:** You haven't run the `coupon-schema.sql` file in Supabase.

---

## 🚀 To Fix the Coupon 404 Error:

### Step 1: Check if Table Exists

Run this in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'coupons';
```

**If it returns empty:** The table doesn't exist → Go to Step 2

**If it returns "coupons":** The table exists → Go to Step 3

---

### Step 2: Create the Coupons Tables

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Open the file: `coupon-schema.sql` from your project
5. Copy the entire contents
6. Paste into SQL Editor
7. Click **Run**

This will create:
- ✅ `coupons` table
- ✅ `coupon_usage` table
- ✅ Update `orders` table with coupon fields
- ✅ Sample coupon codes (WELCOME10, TOJI20, etc.)

---

### Step 3: Verify the Tables Were Created

Run this in Supabase SQL Editor:
```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('coupons', 'coupon_usage');

-- Check sample coupons
SELECT code, name, discount_type, discount_value, is_active 
FROM coupons;
```

**Expected Result:**
```
table_name
----------
coupons
coupon_usage

code        | name                  | discount_type | discount_value | is_active
---------------------------------------------------------------------------
WELCOME10   | Welcome Discount      | percentage    | 10.00          | true
TOJI20      | Toji Influencer Code  | percentage    | 20.00          | true
SUMMER15    | Summer Sale           | percentage    | 15.00          | true
FIXED50     | Fixed 50DH Off        | fixed         | 50.00          | true
```

---

### Step 4: Test the Coupon System

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Go to checkout page:**
   ```
   http://localhost:3000/checkout
   ```
   (Make sure you have items in cart first!)

3. **Try a coupon code:**
   - Enter: `TOJI20`
   - Click: Apply
   - Should show: "✓ Coupon applied successfully!"

4. **Check discount applied:**
   - Should see discount line in order summary
   - Total should be reduced by 20%

---

## 🧪 Quick Test SQL

If you want to test that everything works, run this:

```sql
-- Test 1: Check if coupons table exists
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_name = 'coupons';
-- Expected: 1

-- Test 2: Check if sample coupons exist
SELECT COUNT(*) as coupon_count 
FROM coupons;
-- Expected: 4 or more

-- Test 3: Validate a specific coupon
SELECT 
  code,
  name,
  discount_value,
  is_active,
  CASE 
    WHEN expires_at IS NULL THEN 'Never expires'
    WHEN expires_at > NOW() THEN 'Valid'
    ELSE 'Expired'
  END as status
FROM coupons 
WHERE code = 'TOJI20';
-- Expected: 1 row with is_active = true

-- Test 4: Check orders table has coupon fields
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('coupon_code', 'discount_amount');
-- Expected: 2 rows
```

---

## 📋 Troubleshooting

### Problem: Still getting 404 after running schema

**Solution 1:** Check environment variables
```bash
# In .env.local file:
NEXT_PUBLIC_SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-key
```

**Solution 2:** Restart dev server
```bash
# Stop the server (Ctrl+C)
npm run dev
# Start again
```

**Solution 3:** Clear browser cache
- Press: `Ctrl + Shift + Delete`
- Clear cached images and files
- Reload page

---

### Problem: Error "relation coupons does not exist"

**Solution:** The table wasn't created properly

1. Double-check you ran the entire `coupon-schema.sql` file
2. Look for any errors in the SQL Editor output
3. Make sure you're in the correct project/database

---

### Problem: Coupons table exists but API still returns 404

**Solution:** Check the API route is correct

1. Open: `src/app/api/coupons/route.ts`
2. Verify it exists
3. Check the file starts with:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { createClient } from '@supabase/supabase-js';
   ```

---

## ✅ Success Checklist

After completing the fixes, you should have:

- [x] No hydration errors in console
- [x] `coupons` table exists in Supabase
- [x] `coupon_usage` table exists in Supabase
- [x] Sample coupons are loaded (WELCOME10, TOJI20, etc.)
- [x] `orders` table has `coupon_code` and `discount_amount` columns
- [x] Coupon API returns valid response (not 404)
- [x] Can apply coupons on checkout page
- [x] Discount shows correctly in order summary

---

## 🎯 Expected Console Output After Fix

### Before (Errors):
```
❌ Hydration error: whitespace text nodes...
❌ 404 Failed to load resource: api/coupons?code=HAFSSI&validate=true
```

### After (Clean):
```
✅ No hydration errors
✅ Coupon API responds with 200 or proper validation message
✅ Console is clean
```

---

## 📞 Still Having Issues?

If you're still seeing problems after following these steps:

1. **Check Supabase Dashboard:**
   - Go to Table Editor
   - Look for `coupons` table
   - Check if it has data

2. **Check API Route:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try applying a coupon
   - Check the API response

3. **Check Environment Variables:**
   - Make sure `.env.local` has correct keys
   - Restart dev server after changing env vars

4. **Check Console:**
   - Look for any other errors
   - Share the exact error message

---

## 🎉 Summary

**Hydration Error:** ✅ **FIXED** - Layout cleaned up, no extra whitespace

**Coupon 404 Error:** ⏳ **ACTION REQUIRED** 
- Run `coupon-schema.sql` in Supabase
- Restart dev server
- Test coupon codes

Once you run the SQL schema, everything will work perfectly! 🚀

---

**Files to Run:**
1. ✅ Layout fix - Already applied
2. ⏳ `coupon-schema.sql` - **Run this now in Supabase**
3. 🧪 `check-coupons-table.sql` - Use to verify

**Last Updated:** January 27, 2025  
**Status:** Partially Fixed - SQL schema needs to be run
