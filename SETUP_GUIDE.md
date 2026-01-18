# Taste - Complete Setup Guide

This guide will walk you through setting up the Taste platform from scratch.

## Step 1: Create Supabase Project

### 1.1. Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 1.2. Create New Project
1. Click "New Project"
2. Fill in:
   - **Name**: taste-chennai (or your choice)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to you (e.g., Asia South (Mumbai) for India)
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### 1.3. Get Your API Keys
1. Once project is ready, go to **Settings** (gear icon) → **API**
2. Copy and save:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJxxx... (long string)
   service_role: eyJxxx... (long string, keep secret!)
   ```

### 1.4. Get Database Connection String
1. Go to **Settings** → **Database**
2. Scroll to "Connection string"
3. Select "URI" tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
```

## Step 2: Configure Environment Variables

### 2.1. Update .env.local File
Open `.env.local` in your project root and update:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-this-below>

# Supabase - Replace with your values
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres

# Storage
NEXT_PUBLIC_STORAGE_BUCKET=taste-uploads
```

### 2.2. Generate NEXTAUTH_SECRET
Run this command in your terminal:

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Copy the output and paste it as your NEXTAUTH_SECRET.

## Step 3: Run Database Migration

### 3.1. Open SQL Editor in Supabase
1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query** button (top right)

### 3.2. Run the Migration
1. Open `supabase/migrations/001_initial_schema.sql` from your project
2. Copy the ENTIRE file contents (Ctrl+A, Ctrl+C)
3. Paste into the SQL Editor in Supabase
4. Click **Run** button (or press F5)
5. Wait for completion (should take 5-10 seconds)
6. You should see "Success. No rows returned" at the bottom

### 3.3. Verify Tables Created
1. Click **Database** in the left sidebar
2. Click **Tables**
3. You should see multiple tables: users, restaurants, dishes, tasting_notes, groups, etc.

## Step 4: Create Storage Bucket (Optional)

This is needed for image uploads (tasting notes, restaurant photos, avatars).

1. In Supabase, click **Storage** in left sidebar
2. Click **Create a new bucket**
3. Fill in:
   - **Name**: taste-uploads
   - **Public bucket**: Toggle ON (images need to be publicly accessible)
4. Click **Create bucket**
5. Click on the bucket you just created
6. Click **Policies** tab
7. Click **New Policy** → **For full customization**
8. Create SELECT policy:
   - **Policy name**: Public read access
   - **Allowed operation**: SELECT
   - **Target roles**: public
   - **USING expression**: `true`
9. Click **Review** → **Save policy**
10. Create INSERT policy:
    - **Policy name**: Authenticated uploads
    - **Allowed operation**: INSERT
    - **Target roles**: authenticated
    - **WITH CHECK expression**: `true`
11. Click **Review** → **Save policy**

## Step 5: Start the Application

### 5.1. Install Dependencies (if not done)
```bash
npm install
```

### 5.2. Run Development Server
```bash
npm run dev
```

### 5.3. Open in Browser
Go to [http://localhost:3000](http://localhost:3000)

You should see the Taste homepage!

## Step 6: Create Test Accounts

### 6.1. Create Regular User Account
1. Click **Sign Up** button
2. Fill in:
   - Full Name: Test User
   - Email: user@test.com
   - Password: password123 (or stronger)
   - Role: Select **User** (👤)
3. Click **Create Account**
4. You'll be redirected to login
5. Sign in with the credentials

### 6.2. Create Business Account
1. Sign out (click profile → Sign Out)
2. Go to Sign Up page
3. Fill in:
   - Full Name: Restaurant Owner
   - Email: business@test.com
   - Password: password123
   - Role: Select **Business** (🏪)
   - Business Name: Taste of Chennai
   - Business License: (optional, leave blank)
4. Click **Create Account**
5. Note: Business accounts need admin approval

### 6.3. Create Admin Account
1. Sign out
2. Go to Sign Up page
3. Fill in:
   - Full Name: Admin User
   - Email: admin@test.com
   - Password: password123
   - Role: Select **Admin** (⚙️)
4. Click **Create Account**

### 6.4. Verify Business Account (as Admin)
1. Sign in as admin@test.com
2. You'll see Admin Dashboard
3. Click **Business Verification** (currently placeholder)
4. (Note: Full verification UI will be built in Phase 6)

## Step 7: Test the Application

### As User (user@test.com):
- ✅ Dashboard loads with stats
- ✅ Can see navigation menu
- ✅ Header shows user name and avatar
- ✅ Hamburger menu opens with options

### As Business (business@test.com):
- ✅ Redirects to Business Dashboard
- ✅ Can see business-specific tools
- ✅ Different menu options

### As Admin (admin@test.com):
- ✅ Redirects to Admin Dashboard
- ✅ Can see admin tools
- ✅ Platform analytics visible

## Troubleshooting

### Problem: "Cannot read property of undefined"
**Solution**: Make sure you ran the database migration completely. Check in Supabase → Database → Tables that all tables exist.

### Problem: "Invalid environment variables"
**Solution**:
1. Make sure `.env.local` is in the project root (same folder as package.json)
2. Check that all values are filled in (no placeholders)
3. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Problem: "Failed to fetch" on login
**Solution**:
1. Check browser console for errors
2. Verify Supabase project is not paused (free tier pauses after 1 week of inactivity)
3. Test connection: Go to Supabase → SQL Editor and run `SELECT * FROM users;`

### Problem: Page won't load / infinite redirect
**Solution**:
1. Clear browser cookies for localhost:3000
2. Try incognito/private browsing window
3. Check browser console for errors

### Problem: "Middleware" deprecation warning
**Solution**: This is a Next.js 16 warning about renaming. It doesn't affect functionality. We'll update it in a future phase.

## Next Steps

You've completed Phase 1: Foundation! 🎉

**What's working:**
- ✅ User authentication with 3 roles
- ✅ Login/Signup flow
- ✅ Role-based dashboards
- ✅ Protected routes
- ✅ Core layout (Header, Footer, Menu)
- ✅ Database schema

**Next phase (Phase 2):**
- Build restaurant listing and detail pages
- Create tasting notes feature
- Add image upload
- Implement search and filtering

### To Continue Development:

1. Review the plan: Check `/Users/noelps/.claude/plans/starry-wiggling-sunrise.md`
2. Start Phase 2: Restaurants & Notes
3. Or customize: Modify colors, add features, experiment!

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Test production build
npm run lint         # Check for code issues

# Database
# Run migrations: Use Supabase SQL Editor
# View data: Supabase → Database → Tables

# Git
git init             # Initialize git
git add .            # Stage changes
git commit -m "..."  # Commit changes
git push             # Push to remote
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Support

If you run into issues:
1. Check this guide carefully
2. Review error messages in browser console
3. Check Supabase logs (Supabase → Logs)
4. Restart dev server
5. Clear browser cache/cookies

---

Happy building! 🚀
