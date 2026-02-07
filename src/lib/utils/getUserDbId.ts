import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Get the database user ID for the currently authenticated Clerk user.
 * This looks up the user by their email address.
 * Returns null if user is not found or not authenticated.
 */
export async function getUserDbId(): Promise<string | null> {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) return null;

    const supabase = await createClient();
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    return dbUser?.id || null;
  } catch (error) {
    console.error('Error getting user DB ID:', error);
    return null;
  }
}

/**
 * Get full database user info for the currently authenticated Clerk user.
 */
export async function getDbUser(): Promise<{
  id: string;
  email: string;
  full_name: string;
  handle?: string;
  avatar_url?: string;
  role: string;
} | null> {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) return null;

    const supabase = await createClient();
    const { data: dbUser } = await supabase
      .from('users')
      .select('id, email, full_name, handle, avatar_url, role')
      .eq('email', email)
      .maybeSingle();

    return dbUser || null;
  } catch (error) {
    console.error('Error getting user from DB:', error);
    return null;
  }
}
