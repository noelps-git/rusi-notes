import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  const email = user.emailAddresses[0]?.emailAddress;

  // Check if user has a handle with matching clerk_id
  if (email) {
    const supabase = await createClient();
    const { data: dbUser } = await supabase
      .from('users')
      .select('handle, clerk_id')
      .eq('email', email)
      .maybeSingle();

    // Redirect to onboarding if no handle OR clerk_id doesn't match (deleted & re-created account)
    if (!dbUser?.handle || dbUser.clerk_id !== user.id) {
      redirect('/onboarding');
    }
  }

  return (
    <WelcomeDashboard
      userName={user.fullName || 'Friend'}
      userEmail={email || ''}
    />
  );
}
