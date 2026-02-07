import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProfileRedirectPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (email) {
    const supabase = await createClient();
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (dbUser) {
      redirect(`/profile/${dbUser.id}`);
    }
  }

  // If user not found in database, redirect to onboarding
  redirect('/onboarding');
}
