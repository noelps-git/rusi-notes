import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <WelcomeDashboard
      userName={user.fullName || 'Friend'}
      userEmail={user.emailAddresses[0]?.emailAddress || ''}
    />
  );
}
