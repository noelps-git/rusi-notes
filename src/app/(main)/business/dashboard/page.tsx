import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function BusinessDashboardPage() {
  const user = await currentUser();

  if (!user || (user.publicMetadata as any)?.role !== 'business') {
    redirect('/dashboard');
  }

  // Check if business user has a restaurant
  const supabase = await createClient();
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, is_verified')
    .eq('owner_id', user.id)
    .single();

  // If no restaurant, redirect to onboarding
  if (!restaurant) {
    redirect('/onboarding/restaurant');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to {restaurant.name}
          {restaurant.is_verified ? (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⏳ Pending Verification
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Reviews</CardTitle>
            <CardDescription>Customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Rating</CardTitle>
            <CardDescription>Overall score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">0.0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Campaigns</CardTitle>
            <CardDescription>Running ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ad Wallet</CardTitle>
            <CardDescription>Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">₹0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Tools</CardTitle>
            <CardDescription>Manage your restaurant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/business/dishes"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍽️</span>
                <div>
                  <div className="font-medium text-gray-900">Manage Menu</div>
                  <div className="text-sm text-gray-600">Add & update dishes</div>
                </div>
              </div>
            </Link>

            <Link
              href="/business/insights"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <div className="font-medium text-gray-900">Customer Insights</div>
                  <div className="text-sm text-gray-600">Analyze feedback & trends</div>
                </div>
              </div>
            </Link>

            <Link
              href="/business/ads"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📢</span>
                <div>
                  <div className="font-medium text-gray-900">Advertising</div>
                  <div className="text-sm text-gray-600">Create targeted campaigns</div>
                </div>
              </div>
            </Link>

            <Link
              href="/business/restaurants"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏪</span>
                <div>
                  <div className="font-medium text-gray-900">Manage Restaurant</div>
                  <div className="text-sm text-gray-600">Update menu & info</div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>What customers are saying</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              No feedback yet. Encourage customers to leave reviews!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
