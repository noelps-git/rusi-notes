import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <WelcomeDashboard
      userName={session.user.name || 'Friend'}
      userEmail={session.user.email || ''}
    />
  );
}
