# 👀 WHERE TO VIEW USER SIGNUPS - Quick Reference

## 🎯 Fastest Way (30 seconds)

### Option 1: Table Editor (Visual Interface)

```
1. Open browser → https://supabase.com/dashboard
2. Select your project
3. Click "Table Editor" (left sidebar)
4. Click "users" table
5. 🎉 You see all signups in a spreadsheet!
```

**What you'll see:**
```
┌──────────────────────┬───────────────────────┬──────────┬──────────┬─────────────────────┐
│ email                │ name                  │ role     │ image    │ created_at          │
├──────────────────────┼───────────────────────┼──────────┼──────────┼─────────────────────┤
│ john@example.com     │ John Doe              │ user     │ null     │ 2025-01-18 10:30:00 │
│ restaurant@food.com  │ Ravi's Restaurant     │ business │ null     │ 2025-01-18 09:15:00 │
│ admin@rusinotes.com  │ Admin User            │ admin    │ null     │ 2025-01-17 14:20:00 │
└──────────────────────┴───────────────────────┴──────────┴──────────┴─────────────────────┘
```

---

### Option 2: SQL Editor (For Queries)

```
1. Open browser → https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" (left sidebar)
4. Paste this query:

   SELECT * FROM users ORDER BY created_at DESC;

5. Click "Run" or press Ctrl+Enter
6. 🎉 See all users with full details!
```

---

## 📊 Useful Views

### View Today's Signups
**Location:** SQL Editor
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

### Count Users by Type
**Location:** SQL Editor
```sql
SELECT
  role,
  COUNT(*) as total
FROM users
GROUP BY role;
```

### Last 10 Signups
**Location:** SQL Editor
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

---

## 🗺️ Complete Navigation Map

```
Supabase Dashboard (https://supabase.com/dashboard)
│
├─ 📊 Table Editor ← VIEW SIGNUPS HERE (EASIEST)
│   │
│   ├─ users ← All user accounts
│   ├─ tasting_notes ← User reviews
│   ├─ restaurants ← Business listings
│   ├─ friendships ← Friend connections
│   └─ notifications ← User alerts
│
├─ 🔍 SQL Editor ← RUN CUSTOM QUERIES HERE
│   └─ Run queries to analyze signup data
│
├─ 🔐 Authentication ← VIEW AUTH STATUS
│   ├─ Users ← See login methods & verification
│   └─ Policies ← Security settings
│
└─ 📈 Reports ← ANALYTICS DASHBOARD
    └─ See user growth charts
```

---

## 📍 Step-by-Step Screenshot Guide

### To View All Signups:

**Step 1:** Login to Supabase
```
🌐 https://supabase.com/dashboard
```

**Step 2:** Find Your Project
```
Look for: "rusi-notes" (or your project name)
Click to open
```

**Step 3:** Open Table Editor
```
Left Sidebar → Click "Table Editor"
(Icon looks like a table/grid)
```

**Step 4:** Select Users Table
```
Left panel → Tables list → Click "users"
```

**Step 5:** View Data
```
Main panel shows all users in spreadsheet format
- Scroll to see all users
- Click column headers to sort
- Click filter icon to filter by role
- Click any row to see full details
```

---

## 🎨 What Each Column Means

| Column Name      | What It Shows                          | Example                      |
|------------------|----------------------------------------|------------------------------|
| `id`             | Unique user ID (UUID)                  | 123e4567-e89b-12d3-a456...   |
| `email`          | User's email address                   | john@example.com             |
| `name`           | Display name                           | John Doe                     |
| `role`           | User type                              | user / business / admin      |
| `image`          | Profile picture URL                    | https://...                  |
| `email_verified` | When email was verified                | 2025-01-18 10:30:00          |
| `created_at`     | **Signup date/time** ⏰                | 2025-01-18 10:30:00          |
| `updated_at`     | Last profile update                    | 2025-01-19 15:20:00          |

---

## 🔎 Finding Specific Users

### By Email (Table Editor)
1. Open "users" table
2. Use search box at top-right
3. Type email address
4. Results appear instantly

### By Role (Table Editor)
1. Open "users" table
2. Click filter icon (funnel shape)
3. Select "role" column
4. Choose: user / business / admin
5. Click Apply

### By Date Range (SQL Editor)
```sql
-- Users who signed up this week
SELECT * FROM users
WHERE created_at >= date_trunc('week', CURRENT_DATE)
ORDER BY created_at DESC;
```

---

## ⚡ Quick Actions in Table Editor

### View User Details
- Click any row → Full details appear in right panel

### Export Data
- Click export button → Download as CSV

### Refresh Data
- Click refresh icon → See latest signups

### Sort Data
- Click column header → Sort ascending/descending

---

## 📱 Mobile Access

You can also view signups on your phone:

1. Open browser on phone
2. Go to https://supabase.com/dashboard
3. Login
4. Navigate same way: Table Editor → users

*(Interface is mobile-responsive)*

---

## 🎯 Summary: Where to Look

### For Quick View:
**Supabase Dashboard → Table Editor → users table**
*(Best for browsing and checking recent signups)*

### For Analysis:
**Supabase Dashboard → SQL Editor → Run custom queries**
*(Best for counts, filters, and detailed reports)*

### For Auth Status:
**Supabase Dashboard → Authentication → Users**
*(Best for checking email verification and login methods)*

---

## ✅ Checklist: I Can View Signups When...

- [ ] I've run all 4 migration files
- [ ] Tables are created (check Table Editor)
- [ ] My app is connected to this Supabase project
- [ ] Users have actually signed up on my app
- [ ] I'm logged into the correct Supabase project

---

## 🚀 After Setup

Once your app is deployed and users start signing up:

1. **Immediately see them:** Table Editor → users
2. **Get notifications:** Set up email alerts in Supabase
3. **Monitor growth:** Check Reports tab for charts
4. **Run queries:** Use SQL Editor for custom analytics

---

**🎉 You're ready to monitor user signups!**

**Quick Link:** https://supabase.com/dashboard → Table Editor → users
