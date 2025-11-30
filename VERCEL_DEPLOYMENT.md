# 🚀 ScorpionX Vercel Deployment Guide

## Prerequisites ✅
- [x] GitHub repository: https://github.com/youssef-hafssi/scorpionx.ma
- [x] Supabase project configured
- [x] All environment variables ready

## Step 1: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)
1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account (`youssef-hafssi`)
3. **Click "New Project"**
4. **Import** your repository: `youssef-hafssi/scorpionx.ma`
5. **Configure** the project:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy from your project directory
cd "c:\Users\yusse\Desktop\projectscorpionx\scorpionx"
vercel --prod
```

## Step 2: Configure Environment Variables

In your Vercel dashboard, go to **Settings** → **Environment Variables** and add:

### Required Environment Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://mrclbohwhgupznatejha.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2xib2h3aGd1cHpuYXRlamhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTU5NjIsImV4cCI6MjA2OTI5MTk2Mn0.VdTDKthYiQkBsWpzRp7kUGCODBzsUE9Gg_T0mIfwr6E
TELEGRAM_BOT_TOKEN=8134139855:AAF7cGD9GswVbAcQXvCJEKwvRFWgCnIUojk
TELEGRAM_CHAT_ID=1194739533
JWT_SECRET=scorpionx-super-secret-jwt-key-for-admin-auth-2025
```

### Update after deployment:
```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

## Step 3: Deploy and Test

1. **Click Deploy** in Vercel
2. **Wait for deployment** to complete (~2-3 minutes)
3. **Get your deployment URL** (e.g., `https://scorpionx-ma.vercel.app`)
4. **Update** `NEXT_PUBLIC_APP_URL` with your actual URL
5. **Redeploy** to apply the change

## Step 4: Post-Deployment Setup

### Initialize Database (if needed)
1. Visit: `https://your-app.vercel.app/api/auth/setup`
2. Visit: `https://your-app.vercel.app/api/init-stock`

### Test Admin Login
1. Go to: `https://your-app.vercel.app/admin`
2. **Email**: `adminscorpion@scorpionx.com`
3. **Password**: `admin123`

### Test Complete Flow
1. **Customer flow**: Browse → Add to cart → Checkout → Order confirmation
2. **Admin flow**: Login → View orders → Update status → Stock management
3. **Telegram**: Verify notifications are received

## 🔧 Vercel Configuration Files (Optional)

Create `vercel.json` for advanced configuration:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://scorpionx-ma.vercel.app"
  }
}
```

## 🚀 Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `scorpionx.ma`)
3. Configure DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## 🔒 Security Checklist

- [ ] Change default admin password after first login
- [ ] Verify Supabase RLS policies are enabled
- [ ] Test JWT token expiration (24 hours)
- [ ] Verify environment variables are not exposed in client
- [ ] Test all API endpoints with authentication

## 🐛 Troubleshooting

### Common Issues:

1. **Build Errors**: Check build logs in Vercel dashboard
2. **Environment Variables**: Ensure all variables are set in Vercel
3. **Database Connection**: Verify Supabase credentials
4. **Telegram Not Working**: Check bot token and chat ID
5. **Authentication Issues**: Verify JWT_SECRET is set

### Build Command Issues:
```bash
# If build fails, try:
npm run build --verbose

# Check dependencies:
npm install --production=false
```

## 📱 Expected URLs

After deployment, your app will be available at:
- **Main Site**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- **Product Page**: `https://your-app.vercel.app/product`
- **API Health**: `https://your-app.vercel.app/api/auth/me` (should return 401)

## 🎉 Success Criteria

✅ **Deployment successful when:**
- [ ] Site loads without errors
- [ ] Admin login works
- [ ] Orders can be placed
- [ ] Stock management functions
- [ ] Telegram notifications sent
- [ ] All pages render correctly

---

**Need Help?** Check Vercel's deployment logs and function logs for detailed error messages.
