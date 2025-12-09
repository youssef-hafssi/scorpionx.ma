# Environment Variables for Vercel Deployment

This file lists all environment variables needed for the ScorpionX application to work on Vercel.

## Required Environment Variables

### 1. Supabase Configuration
Get these from your Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**How to find these:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. JWT Secret for Admin Authentication

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Generate a secure JWT secret:**
- Run: `openssl rand -base64 32`
- Or use any secure random string generator
- **Important**: Use the SAME value in all environments (local and production)

### 3. Telegram Bot Configuration (Optional)

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

These are optional and only needed if you want order notifications via Telegram.

### 4. Application URL

```
NEXT_PUBLIC_APP_URL=https://www.scorpionx.ma
```

Used for generating links in notifications.

## How to Add to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Select your `scorpionx.ma` project
3. Go to **Settings** → **Environment Variables**
4. For each variable above:
   - Click **Add New**
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Select: ✅ Production ✅ Preview ✅ Development
   - Click **Save**
5. After adding all variables, go to **Deployments**
6. Click **⋯** on latest deployment → **Redeploy**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add NEXT_PUBLIC_APP_URL

# Redeploy
vercel --prod
```

## Checklist

Before deploying, ensure you have set:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET`
- [ ] `TELEGRAM_BOT_TOKEN` (optional)
- [ ] `TELEGRAM_CHAT_ID` (optional)
- [ ] `NEXT_PUBLIC_APP_URL`

## Testing

After deployment with environment variables:

1. Visit https://www.scorpionx.ma/admin/login
2. Login with:
   - Email: `adminscorpion@scorpionx.com`
   - Password: `admin123`
3. Should redirect to `/admin/orders`
4. Check browser console for debug logs

## Troubleshooting

**Login still not working?**
- Verify all environment variables are set correctly
- Check that you redeployed after adding variables
- Ensure JWT_SECRET is the same as your local environment
- Check browser console for error messages
