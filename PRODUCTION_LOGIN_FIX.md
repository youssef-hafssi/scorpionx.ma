# Production Login Redirect Fix

## Problem
Login works on localhost but fails to redirect on production (scorpionx.ma). Cookies are created but the redirect doesn't happen.

## Root Causes Identified

1. **Missing Cookie Domain**: Cookies were not setting a domain attribute, making them unavailable across the site
2. **Missing Credentials in Fetch**: Fetch requests weren't explicitly including credentials
3. **Timing Issue**: Redirect happened before cookies were fully propagated
4. **Wrong APP_URL**: Environment variable was set to localhost instead of production URL

## Fixes Applied

### 1. Cookie Configuration (`src/app/api/auth/login/route.ts`)
```typescript
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
  // Set domain for production to work across all paths
  ...(isProduction && { domain: '.scorpionx.ma' }),
};
```

**Key Changes:**
- Added `domain: '.scorpionx.ma'` for production (with leading dot for subdomain support)
- Better environment detection logging
- Cookies now work across entire scorpionx.ma domain

### 2. Fetch Credentials (`src/lib/auth-context.tsx`)
```typescript
await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ← ADDED
  body: JSON.stringify({ email, password }),
});
```

**Key Changes:**
- Added `credentials: 'include'` to all fetch requests (login, logout, verify)
- Ensures cookies are sent with cross-origin requests
- Required for proper cookie handling in production

### 3. Redirect Timing (`src/app/admin/login/page.tsx`)
```typescript
await login(email, password);
// Add delay to ensure cookies are set
await new Promise(resolve => setTimeout(resolve, 100));
window.location.href = '/admin/orders';
```

**Key Changes:**
- Added 100ms delay before redirect
- Ensures cookies are fully propagated before navigation
- Helps with browser cookie synchronization

### 4. Environment Variable (`.env.local`)
```bash
NEXT_PUBLIC_APP_URL=https://scorpionx.ma
```

**Key Changes:**
- Updated from `http://localhost:3000` to production URL
- Must be set in Vercel environment variables too

## Deployment Steps

### 1. Update Vercel Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Update or add:
```
NEXT_PUBLIC_APP_URL = https://scorpionx.ma
```

Make sure this is set for **Production** environment.

### 2. Deploy Changes

```bash
# Commit changes
git add .
git commit -m "Fix production login redirect with cookie domain and credentials"
git push origin main
```

Vercel will automatically deploy.

### 3. Test Production Login

1. Go to https://scorpionx.ma/admin/login
2. Open browser DevTools (F12) → Console tab
3. Login with either admin account:
   - `admin@scorpion.ma` / `hafssi123`
   - `adminscorpion@scorpionx.com` / `admin123`
4. Check console logs for:
   - "Login successful, cookie should be set"
   - "Redirecting to admin orders..."
5. Should redirect to https://scorpionx.ma/admin/orders

### 4. Verify Cookies Are Set

In DevTools → Application tab → Cookies → https://scorpionx.ma:
- ✓ `admin-token` - Should be present with HttpOnly flag
- ✓ `admin-session` - Should be present with HttpOnly flag
- ✓ Both should have Domain: `.scorpionx.ma`
- ✓ Both should have Path: `/`
- ✓ Both should have Secure flag
- ✓ Both should have SameSite: Lax

## Technical Details

### Why Domain Matters
```
Without domain:     cookie domain = scorpionx.ma (exact match only)
With domain:        cookie domain = .scorpionx.ma (works for all subdomains)
```

The leading dot (`.scorpionx.ma`) allows cookies to work across:
- scorpionx.ma
- www.scorpionx.ma
- Any subdomain

### Why Credentials Matter
In production with HTTPS and cross-origin considerations, browsers are stricter about cookie handling. The `credentials: 'include'` tells the browser:
1. Send cookies with this request
2. Save cookies from the response
3. Even if there are CORS considerations

### Why Timing Matters
The 100ms delay allows:
1. Response headers to be fully processed
2. Cookies to be written to browser storage
3. Browser to synchronize cookie state
4. Middleware to read cookies on next request

## Troubleshooting

### If Login Still Doesn't Redirect

1. **Check Console Logs**:
   ```
   - Should see "Login successful, cookie should be set"
   - Should see "Redirecting to admin orders..."
   ```

2. **Check Network Tab** (DevTools):
   - POST to `/api/auth/login` should return 200
   - Response should include `Set-Cookie` headers
   - GET to `/admin/orders` should include `Cookie` headers

3. **Check Cookies** (DevTools → Application):
   - Look for `admin-token` and `admin-session`
   - Verify Domain is `.scorpionx.ma`
   - Verify HttpOnly and Secure flags are set

4. **Check Middleware Logs** (Vercel → Functions → Logs):
   - Should see "Token valid for user: [email]"
   - Should NOT see "No token found" or "Invalid token"

### If Cookies Are Not Being Set

1. Verify `NODE_ENV=production` in Vercel
2. Verify domain is accessed via HTTPS (not HTTP)
3. Check if browser is blocking third-party cookies (shouldn't affect first-party)

### If Redirect Loops

1. Check if token is being created correctly
2. Verify JWT_SECRET is the same in Vercel as in database hash generation
3. Check middleware logs for verification errors

## Additional Monitoring

Add to `middleware.ts` for production debugging:
```typescript
console.log('Middleware check:', {
  pathname,
  hasToken: !!token,
  tokenLength: token?.length || 0,
  cookiesRaw: request.headers.get('cookie'),
});
```

This helps debug if cookies are being sent at all.

## Summary

The fixes ensure:
✓ Cookies are set with correct domain for production
✓ Cookies are included in all auth-related requests
✓ Redirect happens after cookies are fully set
✓ Environment variables match production setup

After deploying these changes, production login should work exactly like localhost.
