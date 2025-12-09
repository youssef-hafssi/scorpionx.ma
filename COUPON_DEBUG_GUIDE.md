# 🔍 Coupon API Database Connection Diagnostic

## Issue
Getting 404 errors when trying to validate coupon codes:
```
api/coupons?code=HAFSSI&validate=true → 404 Not Found
```

---

## 🧪 How to Diagnose the Issue

### Step 1: Check if Coupon Tables Exist in Database

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run the test script: `test-coupon-api.sql`

This will tell you:
- ✅ If `coupons` table exists
- ✅ If `coupon_usage` table exists
- ✅ If `orders` table has coupon columns
- ✅ List of all coupons in database
- ✅ Whether the specific coupon exists

### Step 2: Test the API Debug Endpoint

Open in your browser or use curl:

**Test if coupons table is accessible:**
```
http://localhost:3000/api/coupons/debug
```

**Test if specific coupon exists:**
```
http://localhost:3000/api/coupons/debug?code=HAFSSI
```

This debug endpoint will show you:
- ✅ If Supabase connection is working
- ✅ If environment variables are set
- ✅ If the coupons table exists
- ✅ List of all coupons in database
- ✅ If your specific coupon code exists
- ✅ Detailed error messages

---

## 🔧 Most Likely Causes & Solutions

### Cause 1: Coupon Tables Don't Exist Yet ❌

**Symptom:**
- 404 errors on coupon API
- Debug endpoint shows "table does not exist"

**Solution:**
```sql
-- Run this in Supabase SQL Editor:
-- File: coupon-schema.sql
```
1. Go to Supabase SQL Editor
2. Copy entire contents of `coupon-schema.sql`
3. Click "Run" to create tables

**Verify:**
```sql
-- Should return true
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'coupons'
);
```

---

### Cause 2: Coupon Code Doesn't Exist ❌

**Symptom:**
- Table exists but specific coupon not found
- Debug shows `found: false`

**Solution:**
The sample coupons in `coupon-schema.sql` are:
- `WELCOME10` - 10% off
- `TOJI20` - 20% off
- `SUMMER15` - 15% off
- `FIXED50` - 50 DH off

If you want to create "HAFSSI", run:
```sql
INSERT INTO coupons (code, name, discount_type, discount_value, is_active) 
VALUES ('HAFSSI', 'Hafssi Discount', 'percentage', 15, true);
```

---

### Cause 3: Environment Variables Missing ❌

**Symptom:**
- Debug endpoint shows `hasSupabaseUrl: false` or `hasServiceKey: false`

**Solution:**
Check `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Verify:**
```bash
# In PowerShell, restart dev server
npm run dev
```

---

### Cause 4: Wrong Supabase Client ❌

**Symptom:**
- Using anon key instead of service role key
- Permission denied errors

**Check:**
The API route should use:
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← Must be SERVICE_ROLE_KEY
);
```

---

## 📊 Expected Behavior

### When Coupon Exists and Valid:
**Request:**
```
GET /api/coupons?code=TOJI20&validate=true
```

**Response (200 OK):**
```json
{
  "valid": true,
  "coupon": {
    "id": "uuid",
    "code": "TOJI20",
    "name": "Toji Influencer Code",
    "discount_type": "percentage",
    "discount_value": 20,
    "influencer_name": "Toji"
  }
}
```

### When Coupon Doesn't Exist:
**Request:**
```
GET /api/coupons?code=INVALID&validate=true
```

**Response (404 Not Found):**
```json
{
  "valid": false,
  "message": "Invalid coupon code"
}
```

### When Coupon Expired:
**Response (400 Bad Request):**
```json
{
  "valid": false,
  "message": "This coupon has expired"
}
```

---

## 🧪 Quick Test Procedure

### 1. Test Database Connection
```bash
# Open in browser:
http://localhost:3000/api/coupons/debug
```

**Look for:**
```json
{
  "connectionCreated": true,
  "tableExists": true,
  "allCouponsQuery": {
    "success": true,
    "count": 4,
    "coupons": [...]
  }
}
```

### 2. Test Specific Coupon
```bash
# Open in browser:
http://localhost:3000/api/coupons/debug?code=WELCOME10
```

**Look for:**
```json
{
  "specificCouponQuery": {
    "success": true,
    "found": true,
    "coupon": {
      "code": "WELCOME10",
      "discount_value": 10
    }
  }
}
```

### 3. Test on Checkout Page
1. Go to: http://localhost:3000/checkout (add items to cart first)
2. Enter coupon code: `WELCOME10`
3. Click "Apply"
4. Should see green success message and discount applied

---

## 🔍 Debug Checklist

Run through this checklist:

- [ ] **Tables exist?** Run `test-coupon-api.sql` in Supabase
- [ ] **Sample coupons inserted?** Check if `WELCOME10` exists
- [ ] **API accessible?** Visit `/api/coupons/debug`
- [ ] **Environment variables set?** Check `.env.local`
- [ ] **Service role key correct?** Not using anon key
- [ ] **Dev server restarted?** After any .env changes
- [ ] **Browser cache cleared?** Hard refresh (Ctrl+Shift+R)

---

## 📝 Common Error Messages & Meanings

### Error: "relation 'coupons' does not exist"
**Meaning:** Table not created yet  
**Fix:** Run `coupon-schema.sql` in Supabase

### Error: "Invalid coupon code" (404)
**Meaning:** Coupon doesn't exist in database  
**Fix:** Insert the coupon or use existing ones

### Error: "Failed to fetch coupons" (500)
**Meaning:** Database connection failed  
**Fix:** Check environment variables and Supabase URL

### Error: "permission denied for table coupons"
**Meaning:** Wrong API key (using anon instead of service role)  
**Fix:** Use `SUPABASE_SERVICE_ROLE_KEY` in API

---

## 🎯 Quick Fix for "HAFSSI" Coupon

If you want the "HAFSSI" coupon to work, run this in Supabase:

```sql
-- Create HAFSSI coupon
INSERT INTO coupons (
  code, 
  name, 
  discount_type, 
  discount_value, 
  influencer_name,
  is_active
) VALUES (
  'HAFSSI',
  'Hafssi Special Discount',
  'percentage',
  15,
  'Hafssi',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  influencer_name = EXCLUDED.influencer_name,
  is_active = EXCLUDED.is_active;

-- Verify it was created
SELECT code, name, discount_value, is_active 
FROM coupons 
WHERE code = 'HAFSSI';
```

---

## 🚀 Recommended Testing Order

1. **First:** Run `coupon-schema.sql` in Supabase (if not done)
2. **Second:** Test `/api/coupons/debug` endpoint
3. **Third:** Test with sample coupon `WELCOME10`
4. **Fourth:** Create and test your custom coupons
5. **Fifth:** Test on actual checkout page

---

## 📞 Getting More Info

If issues persist, check:

1. **Supabase Logs:**
   - Dashboard → Logs → API
   - Look for failed queries

2. **Browser Console:**
   - F12 → Console tab
   - Look for red errors

3. **API Response:**
   - F12 → Network tab
   - Click failed request
   - Check "Preview" tab for error details

4. **Server Logs:**
   - Terminal running `npm run dev`
   - Look for Node.js errors

---

## ✅ Success Indicators

You'll know it's working when:

✅ `/api/coupons/debug` shows `tableExists: true`  
✅ `/api/coupons/debug` lists all coupons  
✅ `/api/coupons?code=WELCOME10&validate=true` returns 200  
✅ Checkout page shows green success when applying coupon  
✅ Discount appears in order summary  
✅ Admin page at `/admin/coupons` loads and shows coupons

---

## 📁 Files for Reference

**Debug/Test Files:**
- `test-coupon-api.sql` - SQL diagnostics
- `src/app/api/coupons/debug/route.ts` - API debug endpoint

**Schema Files:**
- `coupon-schema.sql` - Creates tables and sample data

**API Files:**
- `src/app/api/coupons/route.ts` - Main coupon API

**Frontend Files:**
- `src/components/coupon-input.tsx` - Coupon input component
- `src/lib/coupon-context.tsx` - Coupon state management

---

**Last Updated:** January 27, 2025  
**Purpose:** Diagnose and fix coupon API 404 errors  
**Priority:** High - Required for coupon system to work
