# ScorpionX Deployment Checklist

## ✅ Environment Variables Required

Make sure to add this missing environment variable in Vercel:

```
JWT_SECRET=scorpionx-super-secret-jwt-key-for-admin-auth-2025
```

And update the app URL for production:
```
NEXT_PUBLIC_APP_URL=https://your-deployed-app-url.vercel.app
```

## 📋 Complete Environment Variables List:

1. `NEXT_PUBLIC_SUPABASE_URL` - ✅ Added
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - ✅ Added  
3. `TELEGRAM_BOT_TOKEN` - ✅ Added
4. `TELEGRAM_CHAT_ID` - ✅ Added
5. `JWT_SECRET` - ⚠️ **MISSING - ADD THIS**
6. `NEXT_PUBLIC_APP_URL` - ⚠️ **UPDATE FOR PRODUCTION**

## 🚀 Deployment Steps:

1. **Add JWT_SECRET** in Vercel environment variables
2. **Click Deploy**
3. **After deployment**, update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. **Redeploy** to apply the URL change

## 🔧 Post-Deployment Tasks:

1. **Test Admin Login**: `https://your-app.vercel.app/admin`
   - Email: `adminscorpion@scorpionx.com`
   - Password: `admin123`

2. **Test Telegram Notifications**: Place a test order to verify notifications work

3. **Initialize Stock Data** (if needed):
   - Visit: `https://your-app.vercel.app/api/init-stock`
   - This will create sample product and stock data

## 🔒 Security Notes:

- ✅ JWT_SECRET is secure for production
- ✅ Supabase RLS policies are in place
- ✅ Admin routes are protected by middleware
- ⚠️ **Change default admin password** after first login

## 🐛 Troubleshooting:

If deployment fails:
1. Check build logs for TypeScript/ESLint errors
2. Verify all environment variables are set
3. Ensure Supabase database is properly set up with all tables
