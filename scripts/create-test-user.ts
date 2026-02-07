import { createClient } from '@supabase/supabase-js';

// Load from .env.local manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach((line: string) => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key.trim()] = value;
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  console.log('Creating test user...');

  const testUser = {
    email: 'test_food@example.com',
    full_name: 'Test Foodie',
    handle: 'test_food',
    password_hash: 'test_managed',
    role: 'user',
  };

  // Check if user already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', testUser.email)
    .maybeSingle();

  if (existing) {
    console.log('Test user already exists with ID:', existing.id);
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .insert(testUser)
    .select()
    .single();

  if (error) {
    console.error('Error creating test user:', error);
    return;
  }

  console.log('Test user created successfully!');
  console.log('User ID:', data.id);
  console.log('Email:', data.email);
  console.log('Handle:', data.handle);
}

createTestUser();
