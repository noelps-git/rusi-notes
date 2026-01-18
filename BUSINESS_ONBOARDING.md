# Business Restaurant Onboarding Flow ✅

## Overview
When a business user signs up and logs in for the first time, they are automatically redirected to the restaurant onboarding page to register their restaurant.

---

## The Flow

### 1. Business User Signup
- User selects **"Business"** role during signup
- Provides business name and email
- Account is created with `role = 'business'`

### 2. First Login Redirect
- Business user logs in
- System checks if they have a restaurant registered
- **If NO restaurant**: Redirects to `/onboarding/restaurant`
- **If HAS restaurant**: Goes to `/business/dashboard`

### 3. Restaurant Onboarding Form

**Page**: `/onboarding/restaurant`

**Required Fields**:
- ✅ Restaurant Name
- ✅ Categories (multiple selection from 12 options)
- ✅ Address (full street address)
- ✅ Phone Number
- ✅ GST Number (for verification)

**Optional Fields**:
- Description
- Email
- Website
- Price Range (₹, ₹₹, ₹₹₹)

**Categories Available**:
1. South Indian 🍛
2. North Indian 🍜
3. Chettinad 🌶️
4. Seafood 🦐
5. Biryani 🍚
6. Chinese 🥢
7. Continental 🍽️
8. Fast Food 🍔
9. Café ☕
10. Bakery 🥐
11. Street Food 🌮
12. Desserts 🍨

### 4. Submission
- Form validates all required fields
- Restaurant is created with `is_verified = false`
- Business user is redirected to Business Dashboard
- Restaurant appears in public list as "Pending Verification"

### 5. Verification Process
- Admin reviews the restaurant
- Checks GST number and business details
- Approves or rejects
- Once approved: `is_verified = true`
- Restaurant becomes fully visible to public

---

## Database Schema

### Updated `restaurants` Table
```sql
ALTER TABLE restaurants ADD COLUMN gst_number VARCHAR(15);
```

**New Field**:
- `gst_number` - GST registration number (kept private)

---

## API Endpoints

### POST /api/restaurants
**Body**:
```json
{
  "name": "Restaurant Name",
  "description": "Optional description",
  "categories": ["south_indian", "vegetarian"],
  "address": "Full street address",
  "city": "Chennai",
  "phone": "+91 44 1234 5678",
  "email": "contact@restaurant.com",
  "website": "https://restaurant.com",
  "gst_number": "29XXXXX1234X1Z5",
  "price_range": "₹₹"
}
```

**Response**: Created restaurant object

### GET /api/business/restaurant
**Purpose**: Check if business user has a restaurant
**Response**:
```json
{
  "hasRestaurant": true,
  "restaurant": {
    "id": "uuid",
    "name": "Restaurant Name",
    "is_verified": false
  }
}
```

---

## Files Created

```
src/
├── app/
│   ├── (main)/
│   │   ├── onboarding/
│   │   │   └── restaurant/
│   │   │       └── page.tsx          # Onboarding form
│   │   └── business/
│   │       └── dashboard/
│   │           └── page.tsx          # Updated with restaurant check
│   └── api/
│       ├── restaurants/
│       │   └── route.ts              # Updated to accept GST
│       └── business/
│           └── restaurant/
│               └── route.ts          # Check restaurant status
supabase/
└── migrations/
    └── 002_add_gst_number.sql        # Migration file
```

---

## UI Features

### Onboarding Page
- **Beautiful gradient background** (orange → pink → purple)
- **Multi-select categories** with visual checkmarks
- **Form validation** with error messages
- **Price range selector** with visual buttons
- **GST field** with privacy note
- **Info box** explaining verification process
- **Responsive design** for all devices

### Business Dashboard
- Shows restaurant name in header
- **Verification badge**:
  - ✓ Verified (green) - Restaurant is approved
  - ⏳ Pending Verification (yellow) - Awaiting admin approval
- Stats cards (reviews, rating, campaigns, wallet)
- Quick links to business tools

---

## Testing the Flow

### Step 1: Sign Up as Business
1. Go to http://localhost:3001/signup
2. Click **"Business"** role card
3. Fill in business details
4. Submit

### Step 2: Login
1. Go to http://localhost:3001/login
2. Enter credentials
3. **Automatically redirected to** `/onboarding/restaurant`

### Step 3: Fill Onboarding Form
1. Restaurant Name: "Test Restaurant"
2. Select categories: South Indian, Café
3. Address: "123 Main St, T. Nagar, Chennai"
4. Phone: "+91 44 1234 5678"
5. GST: "29XXXXX1234X1Z5"
6. Price Range: ₹₹
7. Click "Submit for Review"

### Step 4: View Dashboard
1. Redirected to `/business/dashboard`
2. See restaurant name in header
3. See "⏳ Pending Verification" badge
4. Access business tools

### Step 5: Check Public List
1. Go to `/restaurants`
2. Your restaurant appears in the list
3. Click to view details
4. All information is visible

---

## Admin Approval (Future)

**To be implemented in Phase 6 (Admin Panel)**:
- Admin dashboard to review pending restaurants
- View GST number and business details
- Approve or reject with reason
- Email notification to business owner
- Public visibility toggle

---

## Security & Privacy

### GST Number
- ✅ Stored in database
- ✅ **Never shown** in public APIs
- ✅ Only visible to:
  - Restaurant owner
  - Admin users
- ✅ Used for verification only

### Restaurant Verification
- All new restaurants start as **unverified**
- Unverified restaurants:
  - ✅ Appear in public list
  - ✅ Can be viewed
  - ✅ Can receive reviews
  - ⚠️ Show "Pending Verification" badge
- Admin must manually verify

---

## Business User Journey

1. **Day 1 - Sign Up**
   - Create business account
   - Fill restaurant onboarding form
   - Submit for review

2. **Day 2-3 - Wait for Approval**
   - Restaurant visible as "Pending"
   - Can access business dashboard
   - Can view tools (insights, ads)
   - Waiting for admin verification

3. **Day 4 - Approved!**
   - Admin verifies restaurant
   - "✓ Verified" badge appears
   - Full access to business features
   - Can run ad campaigns
   - Track customer feedback

4. **Ongoing - Manage Business**
   - Update menu and dishes
   - View customer insights
   - Create targeted ads
   - Respond to reviews
   - Track performance

---

## What Happens Next?

After onboarding:
1. ✅ Restaurant appears in public list
2. ✅ Users can view and review
3. ✅ Business owner gets dashboard access
4. ⏳ Awaits admin verification (Phase 6)
5. ⏳ Can add dishes to menu (Phase 5)
6. ⏳ Can create ad campaigns (Phase 5)
7. ⏳ Can view customer insights (Phase 5)

---

## Benefits

### For Business Owners
- **Quick onboarding** (< 5 minutes)
- **Automatic listing** in public directory
- **Dashboard access** immediately
- **Free to list** restaurant
- **Verification badge** builds trust

### For Platform
- **GST verification** ensures legitimate businesses
- **Required categories** improve search/filtering
- **Structured data** for better UX
- **Admin control** over quality
- **Scalable process** for many restaurants

---

## Migration Instructions

**IMPORTANT**: Run this migration on Supabase before testing!

1. Go to Supabase SQL Editor
2. Copy contents of `supabase/migrations/002_add_gst_number.sql`
3. Paste and run:
```sql
ALTER TABLE restaurants ADD COLUMN gst_number VARCHAR(15);
CREATE INDEX idx_restaurants_gst ON restaurants(gst_number);
COMMENT ON COLUMN restaurants.gst_number IS 'GST number for business verification (kept private)';
```

4. Verify migration:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'restaurants' AND column_name = 'gst_number';
```

---

## Success! ✅

Business onboarding is complete and ready to use!

**Next**: Continue with Phase 3 to build Groups, Chat, and User Profiles! 🚀
