# Fix 404 Error on Vercel

Your code has been pushed successfully. The 404 error happens because environment variables are missing in Vercel.

## ✅ Steps to Fix

### 1. Go to Vercel Project Settings

1. Open your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project: `rusi-notes`
3. Go to **Settings** → **Environment Variables**

### 2. Add ALL Required Environment Variables

Add these **7 environment variables** for **Production** environment:

#### ✅ NextAuth Configuration

**Variable:** `NEXTAUTH_URL`
**Value:** `https://your-deployment-url.vercel.app` (get this from your deployment)

**Variable:** `NEXTAUTH_SECRET`
**Value:** Generate with `openssl rand -base64 32`

#### ✅ Supabase Configuration

**Variable:** `NEXT_PUBLIC_SUPABASE_URL`
**Value:** Your Supabase project URL (https://xxx.supabase.co)

**Variable:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value:** Your Supabase anon public key

**Variable:** `SUPABASE_SERVICE_ROLE_KEY`
**Value:** Your Supabase service role key

#### ✅ Database Configuration

**Variable:** `DATABASE_URL`
**Value:** Your Supabase connection string
Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

#### ✅ Storage Configuration

**Variable:** `NEXT_PUBLIC_STORAGE_BUCKET`
**Value:** `taste-uploads`

### 3. Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Wait 2-3 minutes for build to complete

### 4. Update NEXTAUTH_URL

Once deployment is successful:

1. Copy your deployment URL: `https://your-app.vercel.app`
2. Go back to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` with the actual deployment URL
4. Save and redeploy again

---

## Common Issues

### ❌ Build Fails

**Problem:** Missing environment variables
**Solution:** Ensure all 7 variables are added in Vercel

### ❌ Still Getting 404

**Problem:** Environment variables not loaded
**Solution:** Redeploy the project after adding variables

### ❌ Database Connection Error

**Problem:** Wrong DATABASE_URL
**Solution:**
1. Go to Supabase → Settings → Database
2. Copy connection string
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Update in Vercel

---

## Quick Checklist

Before redeploying, verify:

- [ ] All 7 environment variables are added
- [ ] NEXT_PUBLIC_SUPABASE_URL is correct
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- [ ] SUPABASE_SERVICE_ROLE_KEY is correct
- [ ] DATABASE_URL has the correct password
- [ ] NEXT_PUBLIC_STORAGE_BUCKET is set to `taste-uploads`
- [ ] NEXTAUTH_SECRET is generated (32+ characters)
- [ ] NEXTAUTH_URL matches your deployment URL

---

## Where to Get These Values

### Supabase (Get from Dashboard)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
   - Copy `Project URL` → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → Use for `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **Settings** → **Database**
   - Copy `Connection string` → Use for `DATABASE_URL`

### Generate NEXTAUTH_SECRET

Run in terminal:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

---

## After Fix

Once environment variables are set and redeployed:

✅ Visit your deployment URL
✅ Landing page should load with dark theme
✅ Sign up should work
✅ Database connections should work

---

**Your latest code is already on GitHub and Vercel will auto-deploy when you redeploy!** 🚀
