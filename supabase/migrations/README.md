# Database Migrations for Rusi Notes

This directory contains all SQL migration files to set up your Supabase database for the Rusi Notes platform.

## 📋 Migration Files

Run these files **in order** in your Supabase SQL Editor:

### 1. **001_initial_schema.sql** - Core Tables
Creates:
- `users` - User accounts with roles (user/business/admin)
- `sessions` - NextAuth session management
- `restaurants` - Restaurant listings
- `tasting_notes` - User reviews and notes
- `comments` - Threaded comments on notes
- `friendships` - Friend relationships
- `groups` - User groups
- `group_members` - Group membership
- `messages` - Group chat messages
- `bookmarks` - Saved notes

### 2. **002_add_gst_number.sql** - Business Compliance
Adds:
- GST number field for Indian restaurant businesses

### 3. **003_notifications_system.sql** - Real-time Notifications
Creates:
- `notifications` - User notification system with real-time updates

### 4. **004_dishes_and_feedback.sql** - Business Features
Creates:
- `dishes` - Restaurant menu items with dietary info
- `dish_feedback` - Customer ratings and reviews for dishes

## 🚀 How to Run Migrations

### Step 1: Access Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run Each Migration

For **each migration file** (in order 001 → 002 → 003 → 004):

1. Open the migration file in your code editor
2. Copy **ALL** contents (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for "Success. No rows returned" message
6. Verify no errors appear

### Step 3: Verify Tables Created

After running all migrations:

1. Go to **"Table Editor"** in Supabase
2. You should see all these tables:
   - ✅ users
   - ✅ sessions
   - ✅ restaurants
   - ✅ tasting_notes
   - ✅ comments
   - ✅ friendships
   - ✅ groups
   - ✅ group_members
   - ✅ messages
   - ✅ bookmarks
   - ✅ notifications
   - ✅ dishes
   - ✅ dish_feedback

## 📊 Where to View Signup Data

### View User Signups:

1. **In Supabase Dashboard:**
   - Go to **"Table Editor"**
   - Click on **"users"** table
   - You'll see all registered users with:
     - Email
     - Name
     - Role (user/business/admin)
     - Created date
     - Email verification status

2. **Filter Users:**
   - Click the filter icon
   - Filter by `role` to see:
     - `user` - Regular users
     - `business` - Business owners
     - `admin` - Administrators

3. **View User Details:**
   - Click any row to see full user details
   - Check `created_at` to see signup time
   - Check `email_verified` for verification status

### View Recent Signups:

In **SQL Editor**, run:
```sql
SELECT
  id,
  email,
  name,
  role,
  created_at,
  email_verified
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

### Count Users by Role:

```sql
SELECT
  role,
  COUNT(*) as count
FROM users
GROUP BY role;
```

### View User Activity:

```sql
-- Users with their notes count
SELECT
  u.email,
  u.name,
  u.role,
  COUNT(tn.id) as notes_count
FROM users u
LEFT JOIN tasting_notes tn ON u.id = tn.user_id
GROUP BY u.id, u.email, u.name, u.role
ORDER BY notes_count DESC;
```

## 🔒 Security Features

All tables have:
- ✅ **Row Level Security (RLS)** enabled
- ✅ **Policies** for data access control
- ✅ **Indexes** for fast queries
- ✅ **Triggers** for automatic updates
- ✅ **Constraints** for data integrity

## 📱 Next Steps

After migrations are complete:

1. ✅ Set up environment variables in Vercel
2. ✅ Deploy your Next.js application
3. ✅ Test user signup on your live site
4. ✅ Check Supabase Table Editor to see new users appear

## 🆘 Troubleshooting

### Migration Fails

**Error: "relation already exists"**
- Some tables already exist
- You can either:
  - Skip that migration, or
  - Drop the table first: `DROP TABLE table_name CASCADE;`

**Error: "permission denied"**
- Make sure you're using the SQL Editor as project owner
- Check you're in the correct project

### No Data Appearing

1. Check RLS policies are correct
2. Verify your app's `DATABASE_URL` is correct
3. Check API routes are using correct Supabase client

## 📚 Database Schema Overview

```
users (authentication & profiles)
  ↓
├─→ sessions (NextAuth)
├─→ restaurants (owned by business users)
│     ↓
│     └─→ dishes (menu items)
│           ↓
│           └─→ dish_feedback (customer reviews)
├─→ tasting_notes (user reviews)
│     ↓
│     ├─→ comments (with nested replies)
│     └─→ bookmarks (saved by users)
├─→ friendships (friend relationships)
├─→ groups (created by users)
│     ↓
│     ├─→ group_members
│     └─→ messages (group chat)
└─→ notifications (real-time alerts)
```

---

**Ready to accept Chennai foodies! 🍛🦁**
