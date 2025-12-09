# Quick Deploy Guide - Production Login Fix

## Changes Summary

### Files Modified:
1. ✅ `src/app/api/auth/login/route.ts` - Added cookie domain for production
2. ✅ `src/lib/auth-context.tsx` - Added credentials: 'include' to all fetch calls
3. ✅ `src/app/admin/login/page.tsx` - Added 100ms delay before redirect
4. ✅ `.env.local` - Updated APP_URL to production domain

### What Was Fixed:
- 🔧 Cookie domain now set to `.scorpionx.ma` in production
- 🔧 All fetch requests now include credentials
- 🔧 Added timing delay to ensure cookies propagate
- 🔧 Environment URL updated to production

## Deploy Now

### 1. Commit and Push
```bash
git add .
git commit -m "Fix production login redirect - add cookie domain and credentials"
git push origin main
```

### 2. Update Vercel Environment Variable
**IMPORTANT:** Go to Vercel Dashboard and update:
```
NEXT_PUBLIC_APP_URL = https://scorpionx.ma
```
Set this for **Production** environment.

### 3. Test After Deploy
1. Go to https://scorpionx.ma/admin/login
2. Login with: `admin@scorpion.ma` / `hafssi123`
3. Should redirect to orders page

## What to Check

### In Browser Console:
```
✓ "Login successful, cookie should be set"
✓ "Redirecting to admin orders..."
```

### In DevTools → Application → Cookies:
```
✓ admin-token (HttpOnly, Secure, Domain: .scorpionx.ma)
✓ admin-session (HttpOnly, Secure, Domain: .scorpionx.ma)
```

### In Network Tab:
```
✓ POST /api/auth/login → 200 OK with Set-Cookie headers
✓ GET /admin/orders → 200 OK (not redirected to login)
```

## If Still Not Working

1. Clear browser cookies for scorpionx.ma
2. Try in incognito/private mode
3. Check Vercel function logs for errors
4. Verify NEXT_PUBLIC_APP_URL is set in Vercel

## Full Documentation
See `PRODUCTION_LOGIN_FIX.md` for detailed technical explanation.
