# Quick Deploy Guide - Rusi Notes

Your code is committed and ready for deployment! Follow these steps:

---

## ✅ COMPLETED

1. **Code prepared** - All files committed (112 files, 19,254 insertions)
2. **Migrations ready** - Located at `/Users/noelps/taste/supabase/migrations/`
3. **Environment variables documented** - See DEPLOYMENT_GUIDE.md

---

## 🚀 NEXT STEPS

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `rusi-notes` (or your choice)
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** check "Initialize with README" (you already have one)
3. Click **"Create repository"**

### Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rusi-notes.git

# Verify branch is main
git branch

# Push to GitHub
git push -u origin main
```

**Expected output**: You'll see your code being pushed to GitHub.

---

### Step 3: Deploy to Vercel

#### 3.1 Import Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository `rusi-notes`
4. If not visible, click **"Adjust GitHub App Permissions"** and grant access

#### 3.2 Configure Build Settings

Vercel auto-detects Next.js. Verify:
- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Node Version**: 20.x ✅

#### 3.3 Add Environment Variables

Click **"Environment Variables"** and add these **7 required variables**:

**1. NEXTAUTH_URL**
```
https://your-app-name.vercel.app
```
(You'll get this after first deploy - can update later)

**2. NEXTAUTH_SECRET**
```bash
# Generate with:
openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
```

**3. NEXT_PUBLIC_SUPABASE_URL**
```
https://[YOUR-PROJECT-REF].supabase.co
```
(From Supabase Dashboard → Settings → API)

**4. NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
your-anon-public-key-from-supabase
```
(From Supabase Dashboard → Settings → API)

**5. SUPABASE_SERVICE_ROLE_KEY**
```
your-service-role-key-from-supabase
```
(From Supabase Dashboard → Settings → API - Keep this secret!)

**6. DATABASE_URL**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
(From Supabase Dashboard → Settings → Database)

**7. NEXT_PUBLIC_STORAGE_BUCKET**
```
taste-uploads
```

**IMPORTANT**: Set all variables for **Production** environment!

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. Watch build logs for any errors
4. You'll get a deployment URL like: `https://rusi-notes-abc123.vercel.app`

---

### Step 4: Post-Deployment

#### 4.1 Update NEXTAUTH_URL

1. Go to Vercel dashboard → **Settings** → **Environment Variables**
2. Find `NEXTAUTH_URL`
3. Update to your actual URL: `https://your-app-name.vercel.app`
4. **Save**
5. Redeploy: **Deployments** → **...** → **Redeploy**

#### 4.2 Test Your App

Visit your deployment URL and test:
- [ ] Landing page loads with dark theme
- [ ] Sign up with email works
- [ ] Login works
- [ ] Dashboard shows welcome screen
- [ ] Create note functionality
- [ ] Friends page works
- [ ] Groups can be created
- [ ] Group chat works
- [ ] Emoji picker works
- [ ] Voting works

---

## 📋 Pre-Deployment Checklist

Before pushing to GitHub, ensure you've done these in Supabase:

### Supabase Production Setup

1. **Create Production Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name: `rusi-notes-prod`
   - Choose region closest to users (e.g., Mumbai for India)
   - Save the database password!

2. **Run All Migrations** (in SQL Editor)
   - Open Supabase Dashboard → SQL Editor
   - For each migration file, copy contents and run:
     1. `001_initial_schema.sql` ✅
     2. `002_add_gst_number.sql` ✅
     3. `003_notifications_system.sql` ✅
     4. `004_dishes_and_feedback.sql` ✅

3. **Create Storage Bucket**
   - Go to Storage → Create Bucket
   - Name: `taste-uploads`
   - Make it **Public**
   - Add storage policies (see DEPLOYMENT_GUIDE.md)

---

## 🆘 Troubleshooting

### Build Fails on Vercel

**Issue**: TypeScript or build errors

**Solution**:
```bash
# Test build locally first
npm run build

# Fix any errors shown
# Then push to GitHub again
```

### Database Connection Fails

**Issue**: "Unable to connect to database"

**Solution**:
- Verify `DATABASE_URL` is correct in Vercel
- Check Supabase project is not paused
- Ensure all migrations ran successfully

### Images Don't Upload

**Issue**: Storage upload fails

**Solution**:
- Verify `NEXT_PUBLIC_STORAGE_BUCKET` is set to `taste-uploads`
- Check storage bucket is public in Supabase
- Verify storage policies are configured

---

## 📞 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com
- **Full Guide**: See DEPLOYMENT_GUIDE.md
- **Checklist**: See DEPLOYMENT_CHECKLIST.md

---

## 🎯 Current Status

- ✅ Code committed and ready
- ✅ Migrations prepared
- ✅ Documentation complete
- ⏳ **Next**: Create GitHub repository
- ⏳ **Then**: Push to GitHub
- ⏳ **Finally**: Deploy to Vercel

**You're almost there!** 🚀 Just a few more steps to get Rusi Notes live!

---

Built with ❤️ for Chennai food lovers | Thala-approved! 🦁
