const fs = require('fs');

// Read environment variables
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkRestaurants() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?select=id,name,address`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const restaurants = await response.json();

    if (!response.ok) {
      console.error('Error details:', restaurants);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('\n✅ DATABASE CONNECTION SUCCESSFUL!\n');
    console.log(`Found ${restaurants.length} restaurants in database:\n`);

    if (restaurants.length === 0) {
      console.log('❌ No restaurants found. Migration has NOT been run yet.');
      console.log('\nPlease run the migration in Supabase SQL Editor.');
    } else {
      restaurants.forEach((restaurant, index) => {
        console.log(`${index + 1}. ${restaurant.name} - ${restaurant.address}`);
      });
      console.log('\n✅ Migration successful! Restaurants are populated.');
    }

  } catch (error) {
    console.error('❌ Error checking restaurants:', error.message);
  }
}

checkRestaurants();
