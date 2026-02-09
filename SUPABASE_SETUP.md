# 🗄️ Supabase Database Setup Guide

Quick guide to populate your Supabase database and view signup data.

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Enter:
   - **Name:** `rusi-notes` (or your choice)
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to you (Mumbai for India)
4. Click **"Create new project"**
5. ⏳ Wait 2-3 minutes for initialization

### Step 2: Run Database Migrations

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**

**Run each migration file in order:**

#### Migration 1: Initial Schema
1. Open `supabase/migrations/001_initial_schema.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **"Run"** (or Ctrl+Enter)
5. ✅ Wait for "Success" message

#### Migration 2: GST Number
1. Open `supabase/migrations/002_add_gst_number.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ Verify success

#### Migration 3: Notifications
1. Open `supabase/migrations/003_notifications_system.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ Verify success

#### Migration 4: Dishes & Feedback
1. Open `supabase/migrations/004_dishes_and_feedback.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **"Run"**
5. ✅ Verify success

### Step 3: Verify Tables Created

1. Click **"Table Editor"** (left sidebar)
2. You should see 13 tables:
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

---

## 👀 How to View Signup Data

### Method 1: Table Editor (Easiest)

1. Go to **"Table Editor"** in Supabase dashboard
2. Click on **"users"** table in the left panel
3. You'll see all registered users in a spreadsheet view

**Columns you'll see:**
- **id** - Unique user ID
- **email** - User's email address
- **name** - User's display name
- **role** - User type (user/business/admin)
- **image** - Profile picture URL
- **email_verified** - Verification timestamp
- **created_at** - When they signed up ⏰
- **updated_at** - Last profile update

**Tips:**
- Click column headers to sort
- Click filter icon to filter by role
- Click any row to see full details
- Use search box to find specific users

### Method 2: SQL Editor (Advanced)

Go to **SQL Editor** and run queries:

#### View All Users
```sql
SELECT * FROM users
ORDER BY created_at DESC;
```

#### View Recent Signups (Last 10)
```sql
SELECT
  email,
  name,
  role,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

#### Count Users by Role
```sql
SELECT
  role,
  COUNT(*) as total_users
FROM users
GROUP BY role;
```

#### View Users Who Signed Up Today
```sql
SELECT
  email,
  name,
  role,
  created_at
FROM users
WHERE created_at::date = CURRENT_DATE
ORDER BY created_at DESC;
```

#### View Business Users
```sql
SELECT
  email,
  name,
  created_at
FROM users
WHERE role = 'business'
ORDER BY created_at DESC;
```

#### View User Activity
```sql
SELECT
  u.email,
  u.name,
  u.role,
  COUNT(DISTINCT tn.id) as notes_count,
  COUNT(DISTINCT c.id) as comments_count,
  u.created_at as signup_date
FROM users u
LEFT JOIN tasting_notes tn ON u.id = tn.user_id
LEFT JOIN comments c ON u.id = c.user_id
GROUP BY u.id, u.email, u.name, u.role, u.created_at
ORDER BY u.created_at DESC;
```

### Method 3: Authentication Tab

1. Go to **"Authentication"** tab in Supabase
2. Click **"Users"**
3. You'll see all authenticated users
4. This shows auth-specific data like:
   - Last sign in time
   - Sign in methods (email, Google OAuth)
   - Email confirmation status

---

## 📊 Dashboard Views

### Quick Stats Query
Run this in SQL Editor for a dashboard view:

```sql
-- Platform Overview
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE role = 'user') as regular_users,
  (SELECT COUNT(*) FROM users WHERE role = 'business') as business_users,
  (SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE) as signups_today,
  (SELECT COUNT(*) FROM restaurants) as total_restaurants,
  (SELECT COUNT(*) FROM tasting_notes) as total_notes;
```

### Latest Activity
```sql
-- Last 24 Hours Activity
SELECT
  'User Signup' as event_type,
  name as user_name,
  email,
  created_at as event_time
FROM users
WHERE created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT
  'Note Created' as event_type,
  u.name as user_name,
  u.email,
  tn.created_at as event_time
FROM tasting_notes tn
JOIN users u ON tn.user_id = u.id
WHERE tn.created_at > NOW() - INTERVAL '24 hours'

ORDER BY event_time DESC;
```

---

## 🎯 What You Can Track

Once users start signing up, you can monitor:

### User Metrics
- ✅ Total signups
- ✅ Signups by date/time
- ✅ User roles distribution
- ✅ Email verification rate
- ✅ Active vs inactive users

### Engagement Metrics
- ✅ Notes created per user
- ✅ Comments per user
- ✅ Restaurant reviews
- ✅ Friend connections
- ✅ Group participation

### Business Metrics
- ✅ Business account signups
- ✅ Restaurants registered
- ✅ Menu items added
- ✅ Customer feedback received

---

## 🔍 Finding Specific Users

### By Email
1. **Table Editor:** Use search box at top
2. **SQL:** `SELECT * FROM users WHERE email = 'user@example.com';`

### By Signup Date
```sql
-- Users who signed up in January 2025
SELECT * FROM users
WHERE created_at >= '2025-01-01'
  AND created_at < '2025-02-01'
ORDER BY created_at DESC;
```

### By Activity Level
```sql
-- Most active users
SELECT
  u.email,
  u.name,
  COUNT(tn.id) as total_notes
FROM users u
LEFT JOIN tasting_notes tn ON u.id = tn.user_id
GROUP BY u.id, u.email, u.name
ORDER BY total_notes DESC
LIMIT 10;
```

---

## 📱 Real-Time Monitoring

### Auto-Refresh in Table Editor
1. Click on **users** table
2. Click the **refresh** icon (top right)
3. Data updates in real-time

### Watch New Signups
Keep SQL Editor open with this query:
```sql
SELECT
  email,
  name,
  role,
  created_at,
  NOW() - created_at as how_long_ago
FROM users
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

Press F5 to refresh and see new signups appear!

---

## 🔒 Privacy & Security

**Important Notes:**
- Only you (project owner) can see user data in Supabase
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data via the app
- Admin queries in SQL Editor bypass RLS (for management)

**Never share:**
- Your Supabase service_role key
- Direct database access
- SQL Editor access

---

## 🆘 Troubleshooting

### "Table is empty"
- ✅ Users haven't signed up yet
- ✅ App isn't connected to this Supabase project
- ✅ Check environment variables in your app

### "Permission denied"
- ✅ Make sure you're logged into Supabase as project owner
- ✅ You might be viewing as anonymous user

### "Can't see recent signups"
- ✅ Click refresh icon in Table Editor
- ✅ Check filters aren't hiding rows
- ✅ Verify app's DATABASE_URL is correct

---

## 🎉 You're All Set!

Your database is now ready to:
1. ✅ Accept user signups
2. ✅ Store all user data securely
3. ✅ Track activity and engagement
4. ✅ Provide real-time insights

**Next Steps:**
1. Deploy your app to Vercel
2. Test signup flow
3. Watch users appear in Supabase Table Editor!

---

**Need Help?**
- 📚 [Supabase Docs](https://supabase.com/docs)
- 📊 [Table Editor Guide](https://supabase.com/docs/guides/database/tables)
- 🔍 [SQL Editor Guide](https://supabase.com/docs/guides/database/sql-editor)
