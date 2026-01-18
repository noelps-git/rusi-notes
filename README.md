# 🦁 Rusi Notes - Chennai Food Discovery Platform

**"Saapadu Review Podalam! 🍛 Vera Level Insights"**

A modern food discovery and social platform built with Next.js 14, focused on Chennai's culinary scene with Tamil meme culture throughout. Features tasting notes, restaurant discovery, social groups ("Nanba gangs"), business insights, and targeted advertising.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=flat&logo=next.js)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Database-Supabase-green?style=flat&logo=supabase)](https://supabase.com)

> **Mass Level Features! 💯** Built with ❤️ for Chennai food lovers | Thala-approved! 🦁

## Features

### For Users
- Create and share tasting notes with ratings and images
- Browse restaurants by Chennai-specific categories
- Filter by dietary preferences (Vegetarian, Vegan, Jain, Halal, etc.)
- Add allergies and get warnings
- Connect with friends and create food groups
- Group chat with emoji support and voting
- Bookmark favorite restaurants and notes
- Real-time notifications (via polling)

### For Businesses
- Manage restaurant information and dishes
- View customer feedback insights
- Discover what dishes to launch based on feedback
- Create targeted ad campaigns by dietary preferences and location
- Track ad performance (impressions, clicks, ROI)
- Search for similar restaurants by category

### For Admins
- User management and moderation
- Business account verification
- Content moderation tools
- Platform analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Polling (MVP approach)
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))
- Git

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (usually 2-3 minutes)
3. Go to **Settings** → **API** and copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)
4. Go to **Settings** → **Database** and copy the connection string

### 3. Configure Environment Variables

Update the `.env.local` file with your Supabase credentials:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Storage
NEXT_PUBLIC_STORAGE_BUCKET=taste-uploads
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Wait for the migration to complete (should see "Success")

### 5. Create Storage Bucket (Optional - for image uploads)

1. In Supabase Dashboard, go to **Storage**
2. Click **Create Bucket**
3. Name it `taste-uploads`
4. Set it to **Public** bucket
5. Click **Create**

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

### 1. Create Test Accounts

Create three accounts to test all roles:

1. **User Account**: Go to `/signup` and select "User" role
2. **Business Account**: Go to `/signup` and select "Business" role (provide business name)
3. **Admin Account**: Go to `/signup` and select "Admin" role

### 2. Verify Business Account (as Admin)

Businesses need admin approval to access full features. After creating business account:

1. Log in as admin
2. Go to Admin Dashboard → Business Verification
3. Approve the business account

### 3. Explore Features

**As User:**
- Browse restaurants at `/restaurants`
- Create tasting notes at `/notes/create`
- Add friends and create groups

**As Business:**
- View customer insights at `/business/insights`
- Create ad campaigns at `/business/ads`

**As Admin:**
- Manage users at `/admin/users`
- Verify businesses at `/admin/businesses`

## Project Structure

```
taste/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (main)/              # Main app pages
│   │   ├── (marketing)/         # Public pages
│   │   └── api/                 # API routes
│   ├── components/              # React components
│   │   ├── ui/                  # Base UI components
│   │   ├── layout/              # Layout components
│   │   └── [features]/          # Feature components
│   ├── lib/                     # Utilities and configs
│   │   ├── auth/                # NextAuth config
│   │   ├── supabase/            # Database clients
│   │   ├── constants/           # Chennai-specific data
│   │   └── utils/               # Helper functions
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript types
├── supabase/
│   └── migrations/              # Database migrations
└── public/                      # Static assets
```

## Development Workflow

### Phase 1: Foundation (COMPLETED ✅)
- ✅ Authentication with role-based access
- ✅ Database schema
- ✅ Core layout components
- ✅ Basic dashboards

### Phase 2: Restaurants & Notes (NEXT)
- Restaurant CRUD operations
- Tasting notes with images
- Search and filtering
- Favorite restaurants

### Phase 3: Social Features
- Friends system
- Groups and chat
- Voting in groups
- Comments and likes

### Phase 4: Notifications
- Notification polling
- Categorized notifications
- Mark as read

### Phase 5: Business Features
- Dish feedback insights
- Ad campaign creation
- Targeting by preferences

### Phase 6: Admin Panel
- User management
- Business verification
- Content moderation

### Phase 7: Polish
- Static pages
- Mobile optimization
- SEO
- Performance

### Phase 8: Deployment
- Vercel deployment
- Production database
- Monitoring

## Chennai-Specific Features

### Restaurant Categories
- South Indian, Chettinad, Biryani, Seafood
- Street Food, Bakery, Café, Desserts
- North Indian, Chinese, Continental

### Areas Covered
T. Nagar, Anna Nagar, Adyar, Velachery, Mylapore, OMR, ECR, and more

### Dietary Preferences
- Vegetarian, Vegan, Non-Veg
- Eggetarian, Jain, Halal

### Currency
All prices displayed in Indian Rupees (₹)

## Common Issues

### "Invalid environment variables"
- Make sure `.env.local` exists and has all required variables
- Check that all Supabase credentials are correct
- Restart the dev server after changing env variables

### "Database connection failed"
- Verify your DATABASE_URL is correct
- Make sure the database migration ran successfully
- Check Supabase project is not paused

### "NextAuth configuration error"
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your dev server URL
- Clear browser cookies and try again

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

Ready to deploy to production? Follow our comprehensive guides:

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables (see DEPLOYMENT_GUIDE.md)
   - Click Deploy!

3. **Set up Production Database**
   - Create Supabase production project
   - Run all migrations from `supabase/migrations/`
   - Configure storage bucket

### Detailed Guides

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Quick checklist for deployment

### Required Environment Variables

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
DATABASE_URL=postgresql://...
NEXT_PUBLIC_STORAGE_BUCKET=taste-uploads
```

### Deployment Platforms

- ✅ **Vercel** (Recommended) - Zero-config deployment
- ✅ **Netlify** - Works with minor config
- ✅ **Railway** - Full-stack platform
- ✅ **Self-hosted** - Docker support coming soon

## Contributing

This is a learning project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT

---

Built with ❤️ in Chennai
