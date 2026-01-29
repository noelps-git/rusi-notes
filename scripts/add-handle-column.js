const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
const env = {};
for (const line of envLines) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

async function addHandleColumn() {
  console.log('Adding handle column to users table via Supabase REST API...');

  // First, check if column exists by querying the users table structure
  const checkResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=handle&limit=1`, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
  });

  if (checkResponse.ok) {
    console.log('Column "handle" already exists in users table');
    console.log('Migration complete!');
    return;
  }

  // If column doesn't exist, we need to add it via SQL
  // Supabase doesn't expose raw SQL via REST API by default
  // We need to use the Dashboard or the Supabase CLI

  console.log('\n=== Manual Step Required ===');
  console.log('Please run the following SQL in your Supabase Dashboard SQL Editor:');
  console.log('(Dashboard > SQL Editor > New Query)\n');
  console.log('```sql');
  console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS handle VARCHAR(20) UNIQUE;');
  console.log('CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle);');
  console.log('```');
  console.log('\nSupabase Dashboard URL:');
  console.log('https://supabase.com/dashboard/project/oafimydclgmiptjlngji/sql/new');
}

addHandleColumn();
