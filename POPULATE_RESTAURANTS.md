# Populate Chennai Restaurants

The restaurant dropdown is empty because no restaurants have been added to the database yet.

## To Add Restaurants:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to your project**
3. **Click on "SQL Editor" in the left sidebar**
4. **Copy the entire contents** of `supabase/migrations/006_seed_chennai_restaurants.sql`
5. **Paste it into the SQL Editor**
6. **Click "Run"** button

This will add 15 popular Chennai restaurants with their dishes including:
- Saravana Bhavan (T. Nagar)
- Anjappar Chettinad (Mount Road)
- Murugan Idli Shop (T. Nagar)
- Buhari Hotel (Mount Road)
- Sangeetha Restaurant (T. Nagar)
- Nair Mess (Nungambakkam)
- Adyar Ananda Bhavan (Adyar)
- Thalappakatti Biriyani (Velachery)
- Ponnusamy Hotel (Nungambakkam)
- Ratna Cafe (Triplicane)
- Wangs Kitchen (OMR)
- Kalyana Bhavan (Royapettah)
- The Marina (ECR)
- Junior Kuppanna (Gopalapuram)
- Sree Annapoorna (Anna Nagar)

## After Running:

1. Refresh your application
2. Go to "Create Note" page
3. The restaurant dropdown will now show all 15 Chennai restaurants
4. When you select a restaurant, you'll see the dishes available for that restaurant

## What Was Changed:

1. ✅ Created migration file: `006_seed_chennai_restaurants.sql`
2. ✅ Updated all text colors to black (#111111) across entire application
3. ✅ Updated all input/textarea/select fields to have black text globally in `globals.css`
4. ✅ Updated Create Note page with Grab branding (green colors)

All form inputs now display black text by default!
