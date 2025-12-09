# 🚀 Vercel Environment Variables - Complete List

## 📋 All Required Environment Variables for Vercel

Copy these **exact values** to your Vercel Dashboard:

---

## 1️⃣ **Supabase Configuration** (3 variables)

### NEXT_PUBLIC_SUPABASE_URL
```
https://mrclbohwhgupznatejha.supabase.co
```

### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2xib2h3aGd1cHpuYXRlamhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTU5NjIsImV4cCI6MjA2OTI5MTk2Mn0.VdTDKthYiQkBsWpzRp7kUGCODBzsUE9Gg_T0mIfwr6E
```

### SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2xib2h3aGd1cHpuYXRlamhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzcxNTk2MiwiZXhwIjoyMDY5MjkxOTYyfQ.pNWX60roK0OlrBYo6ZJj96AzFRruaLkHjTUAmSoHqpY
```

---

## 2️⃣ **JWT Secret** (1 variable)

### JWT_SECRET
```
uDUoWNK16mveYg4JXxc/KWvR4NSdpo0c4rgR8k5mwCZLgE6tfgFOPDU6FdlafhhjfEq1rnR7jkbvo9dQVkfPXQ==
```

---

## 3️⃣ **Telegram Bot** (2 variables) - Optional but Recommended

### TELEGRAM_BOT_TOKEN
```
8134139855:AAF7cGD9GswVbAcQXvCJEKwvRFWgCnIUojk
```

### TELEGRAM_CHAT_ID
```
1194739533
```

---

## 4️⃣ **App URL** (1 variable)

### NEXT_PUBLIC_APP_URL
```
https://www.scorpionx.ma
```

**Note:** Use your actual Vercel deployment URL. If you don't have a custom domain yet, use:
```
https://scorpionx-ma.vercel.app
```
(or whatever Vercel assigns you)

---

## 📝 **How to Add in Vercel:**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com
2. Select your `scorpionx.ma` project
3. Go to **Settings** → **Environment Variables**

### **Step 2: Add Each Variable**

For **EACH** variable above:

1. Click **"Add New"** button
2. **Key:** Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value:** Paste the value from above
4. **Environment:** Select **ALL** environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### **Step 3: Redeploy**

After adding all variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2-3 minutes)

---

## ✅ **Complete Checklist:**

### Required (Must Have):
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET`
- [ ] `NEXT_PUBLIC_APP_URL`

### Optional (Recommended):
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `TELEGRAM_CHAT_ID`

---

## 🎯 **Quick Copy-Paste Template:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mrclbohwhgupznatejha.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2xib2h3aGd1cHpuYXRlamhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTU5NjIsImV4cCI6MjA2OTI5MTk2Mn0.VdTDKthYiQkBsWpzRp7kUGCODBzsUE9Gg_T0mIfwr6E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2xib2h3aGd1cHpuYXRlamhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzcxNTk2MiwiZXhwIjoyMDY5MjkxOTYyfQ.pNWX60roK0OlrBYo6ZJj96AzFRruaLkHjTUAmSoHqpY

# JWT
JWT_SECRET=uDUoWNK16mveYg4JXxc/KWvR4NSdpo0c4rgR8k5mwCZLgE6tfgFOPDU6FdlafhhjfEq1rnR7jkbvo9dQVkfPXQ==

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=8134139855:AAF7cGD9GswVbAcQXvCJEKwvRFWgCnIUojk
TELEGRAM_CHAT_ID=1194739533

# App URL (Update after deployment)
NEXT_PUBLIC_APP_URL=https://www.scorpionx.ma
```

---

## 🔍 **Verify Variables After Adding:**

### **Check in Vercel:**
Go to Settings → Environment Variables and verify all 7 variables are listed.

### **Test After Deployment:**
```
1. Visit: https://www.scorpionx.ma/admin/login
2. Login with: admin@scorpion.ma / hafssi123
3. Should redirect to: /admin/orders
```

---

## ⚠️ **Common Mistakes to Avoid:**

❌ **Don't** add quotes around values  
✅ Paste the value directly without quotes

❌ **Don't** add spaces before/after values  
✅ Copy-paste exactly as shown

❌ **Don't** forget to select all environments  
✅ Check Production, Preview, and Development

❌ **Don't** forget to redeploy after adding variables  
✅ Always redeploy for changes to take effect

---

## 🐛 **Troubleshooting:**

### **If login fails after deployment:**

1. **Check all variables are set:**
   ```
   Vercel → Settings → Environment Variables
   Should show 7 variables (or 5 if skipping Telegram)
   ```

2. **Verify Supabase setup:**
   ```
   Run setup-database-admin.sql in Supabase
   ```

3. **Check deployment logs:**
   ```
   Vercel → Deployments → Click on deployment → View logs
   Look for any errors mentioning environment variables
   ```

4. **Force rebuild:**
   ```
   Deployments → Redeploy (with "Use existing Build Cache" UNCHECKED)
   ```

---

## 📱 **After Successful Deployment:**

You should be able to:
- ✅ Access https://www.scorpionx.ma
- ✅ Login at https://www.scorpionx.ma/admin/login
- ✅ View orders at https://www.scorpionx.ma/admin/orders
- ✅ Manage stock at https://www.scorpionx.ma/admin/stock
- ✅ Create coupons at https://www.scorpionx.ma/admin/coupons

---

## 🎉 **Summary:**

**Total Variables Needed:** 7 (5 required + 2 optional)

**Time to Add:** ~5 minutes  
**Deployment Time:** ~2-3 minutes  
**Total Setup Time:** ~10 minutes

---

**Created:** December 9, 2024  
**For:** ScorpionX Production Deployment  
**Status:** Ready to Deploy
