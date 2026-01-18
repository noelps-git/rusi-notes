# 🚀 Rusi Notes - Deployment Guide

Complete step-by-step guide to deploy Rusi Notes to production on Vercel with Supabase.

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Supabase account (sign up at https://supabase.com)
- [ ] Domain name (optional, Vercel provides free subdomain)

---

## 🗄️ Step 1: Set Up Production Supabase Database

### 1.1 Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Choose your organization
4. Fill in project details:
   - **Name**: `rusi-notes-prod` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
   - **Pricing Plan**: Free tier is fine to start
5. Click **"Create new project"**
6. Wait 2-3 minutes for project initialization

### 1.2 Get Database Connection Details

Once your project is ready:

1. Go to **Project Settings** → **Database**
2. Copy these values (you'll need them later):
   - **Connection String**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
3. Go to **Project Settings** → **API**
4. Copy these values:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon public** key
   - **service_role** key (keep this secret!)

### 1.3 Run Database Migrations

From your local terminal:

```bash
# Set your Supabase connection string
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run migrations manually via Supabase dashboard:
# 1. Go to SQL Editor in Supabase dashboard
# 2. Create a new query
# 3. Copy contents from each migration file in order:
```

**Run these SQL files in order** in the Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_add_gst_number.sql`
3. `supabase/migrations/003_notifications_system.sql`
4. `supabase/migrations/004_dishes_and_feedback.sql`

For each file:
- Open the file in your code editor
- Copy ALL contents
- Paste into Supabase SQL Editor
- Click **"Run"**
- Verify "Success" message

### 1.4 Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Bucket details:
   - **Name**: `taste-uploads`
   - **Public**: Yes (for user-uploaded images)
4. Click **"Create bucket"**
5. Set up storage policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'taste-uploads');

-- Allow public read access
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'taste-uploads');
```

---

## 🐙 Step 2: Push Code to GitHub

### 2.1 Create GitHub Repository

1. Go to https://github.com/new
2. Create new repository:
   - **Name**: `rusi-notes` (or your choice)
   - **Visibility**: Private (recommended) or Public
   - **DON'T** initialize with README (you already have one)
3. Click **"Create repository"**

### 2.2 Push Local Code to GitHub

From your project directory:

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Prepare for production deployment

- Complete Phase 3 social features
- Rusi Notes branding with Tamil meme culture
- Portfolio-inspired dark design
- Friends, groups, chat, voting systems
- Comments and likes
- User profiles

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rusi-notes.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.3 Verify Push

1. Go to your GitHub repository URL
2. Confirm all files are present
3. Check that `.env.local` is NOT there (it should be gitignored)

---

## ⚡ Step 3: Deploy to Vercel

### 3.1 Import Project to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository `rusi-notes`
4. If not visible, click **"Adjust GitHub App Permissions"** and grant access

### 3.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Node Version**: 20.x (default)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add ALL of these:

#### NextAuth Configuration

**Variable Name**: `NEXTAUTH_URL`
**Value**: `https://your-app-name.vercel.app` (you'll get this after first deploy, can update later)

**Variable Name**: `NEXTAUTH_SECRET`
**Value**: Generate with `openssl rand -base64 32` or use https://generate-secret.vercel.app/32

#### Supabase Configuration

**Variable Name**: `NEXT_PUBLIC_SUPABASE_URL`
**Value**: Your Supabase Project URL (from Step 1.2)

**Variable Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value**: Your Supabase anon public key (from Step 1.2)

**Variable Name**: `SUPABASE_SERVICE_ROLE_KEY`
**Value**: Your Supabase service_role key (from Step 1.2)

#### Database Configuration

**Variable Name**: `DATABASE_URL`
**Value**: Your Supabase connection string (from Step 1.2)

#### Storage Configuration

**Variable Name**: `NEXT_PUBLIC_STORAGE_BUCKET`
**Value**: `taste-uploads`

**IMPORTANT**: Make sure all environment variables are set for **Production** environment!

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. Vercel will show build logs - watch for any errors
4. Once complete, you'll get a deployment URL like: `https://rusi-notes-abc123.vercel.app`

---

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update NEXTAUTH_URL

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL`
4. Update value to your actual deployment URL: `https://your-app-name.vercel.app`
5. Click **"Save"**
6. Trigger a new deployment: **Deployments** → **...** (menu) → **Redeploy**

### 4.2 Set Up Google OAuth (if using)

1. Go to https://console.cloud.google.com
2. Select your project or create new one
3. Navigate to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client
5. Add to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
6. Click **"Save"**

### 4.3 Configure Supabase Auth (Optional)

If using Supabase Auth:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-app-name.vercel.app`
3. Add redirect URLs:
   ```
   https://your-app-name.vercel.app/**
   ```

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Core Features

Visit your production URL and test:

- [ ] **Landing page** loads with dark theme
- [ ] **Sign up** with email works
- [ ] **Google OAuth** login works (if configured)
- [ ] **Dashboard** shows welcome screen
- [ ] **Create note** functionality
- [ ] **Friends** page works
- [ ] **Groups** can be created
- [ ] **Group chat** sends messages
- [ ] **Emoji picker** works
- [ ] **Profile** pages load

### 5.2 Check Database

1. Go to Supabase Dashboard → **Table Editor**
2. Verify new user records appear when you sign up
3. Check that all tables are created correctly

### 5.3 Check Storage

1. Try uploading an image in a note
2. Go to Supabase Dashboard → **Storage** → `taste-uploads`
3. Verify file appears

### 5.4 Monitor Logs

1. In Vercel dashboard, go to **Logs**
2. Watch for any errors during usage
3. Fix any issues that appear

---

## 🎯 Step 6: Custom Domain (Optional)

### 6.1 Add Domain to Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `rusinotes.com`
4. Click **"Add"**

### 6.2 Configure DNS

Vercel will show you DNS records to add. In your domain registrar:

1. Add **A Record**:
   - Name: `@`
   - Value: `76.76.21.21` (Vercel IP)

2. Add **CNAME Record** for www:
   - Name: `www`
   - Value: `cname.vercel-dns.com`

3. Wait 24-48 hours for DNS propagation

### 6.3 Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:
- `https://rusinotes.com`

---

## 🔒 Security Checklist

- [ ] All `.env` files are gitignored
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never exposed to client
- [ ] Database is in production mode (not test mode)
- [ ] Storage bucket has proper RLS policies
- [ ] CORS is configured correctly in Supabase
- [ ] SSL/HTTPS is enabled (Vercel does this automatically)

---

## 📊 Monitoring & Maintenance

### Vercel Analytics (Optional)

1. Go to **Analytics** in Vercel dashboard
2. Enable **Web Analytics** (free tier available)
3. Monitor page views, performance, errors

### Supabase Monitoring

1. Go to **Reports** in Supabase dashboard
2. Monitor:
   - Database size
   - API requests
   - Storage usage
   - Active users

### Error Tracking (Optional)

Consider adding Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Issue**: Build fails with TypeScript errors

**Solution**:
```bash
# Run locally first
npm run build

# Fix all TypeScript errors
# Then push to GitHub
```

### Database Connection Fails

**Issue**: "Unable to connect to database"

**Solution**:
- Verify `DATABASE_URL` is correct
- Check Supabase project is not paused
- Verify IP allowlist in Supabase (Vercel IPs are auto-allowed)

### OAuth Redirect Fails

**Issue**: Google OAuth returns error

**Solution**:
- Check redirect URI in Google Console matches exactly
- Verify `NEXTAUTH_URL` is set correctly
- Clear browser cookies and try again

### Images Don't Upload

**Issue**: Storage upload fails

**Solution**:
- Verify `NEXT_PUBLIC_STORAGE_BUCKET` is set
- Check storage policies in Supabase
- Confirm bucket is public

---

## 📝 Environment Variables Summary

Copy this template for quick reference:

```bash
# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# Storage
NEXT_PUBLIC_STORAGE_BUCKET=taste-uploads
```

---

## 🎉 Success!

Your Rusi Notes app is now live at:
- **Vercel**: `https://your-app-name.vercel.app`
- **Custom Domain** (if configured): `https://rusinotes.com`

Share with your Chennai foodie nanbas! 🦁🍛

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

Built with ❤️ for Chennai food lovers | Thala-approved! 🦁
