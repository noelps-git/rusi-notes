'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import AddDishModal from '@/components/business/AddDishModal';

interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_halal: boolean;
  is_jain: boolean;
  allergens: string[];
  is_available: boolean;
  image_url: string | null;
}

export default function BusinessDishesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'business') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRestaurant();
    }
  }, [status]);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch('/api/business/restaurant');
      if (!res.ok) throw new Error('Failed to fetch restaurant');

      const data = await res.json();
      if (data.hasRestaurant) {
        setRestaurant(data.restaurant);
        fetchDishes(data.restaurant.id);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDishes = async (restaurantId: string) => {
    try {
      const res = await fetch(`/api/dishes?restaurant_id=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch dishes');

      const data = await res.json();
      setDishes(data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const handleToggleAvailability = async (dish: Dish) => {
    try {
      const res = await fetch(`/api/dishes/${dish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dish,
          is_available: !dish.is_available,
        }),
      });

      if (!res.ok) throw new Error('Failed to update dish');

      const updated = await res.json();
      setDishes((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    } catch (error) {
      console.error('Error updating dish:', error);
      alert('Failed to update dish');
    }
  };

  const handleDelete = async (dishId: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;

    try {
      const res = await fetch(`/api/dishes/${dishId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete dish');

      setDishes((prev) => prev.filter((d) => d.id !== dishId));
    } catch (error) {
      console.error('Error deleting dish:', error);
      alert('Failed to delete dish');
    }
  };

  const getDietaryBadges = (dish: Dish) => {
    const badges = [];
    if (dish.is_vegetarian) badges.push({ label: 'Veg', color: 'green' });
    if (dish.is_vegan) badges.push({ label: 'Vegan', color: 'green' });
    if (dish.is_gluten_free) badges.push({ label: 'GF', color: 'blue' });
    if (dish.is_halal) badges.push({ label: 'Halal', color: 'purple' });
    if (dish.is_jain) badges.push({ label: 'Jain', color: 'orange' });
    return badges;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">
            Please register your restaurant first
          </p>
          <button
            onClick={() => router.push('/onboarding/restaurant')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Register Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Manage Dishes
            </h1>
            <p className="text-gray-600">
              Menu items for <strong>{restaurant.name}</strong>
            </p>
          </div>
          <button
            onClick={() => {
              setEditingDish(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            <span className="font-medium">Add Dish</span>
          </button>
        </div>

        {/* Dishes List */}
        {dishes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No dishes added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Your First Dish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                  !dish.is_available ? 'opacity-60' : ''
                }`}
              >
                {/* Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  {dish.image_url ? (
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🍽️</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {dish.name}
                    </h3>
                    {dish.price && (
                      <span className="text-lg font-bold text-indigo-600">
                        ₹{dish.price}
                      </span>
                    )}
                  </div>

                  {dish.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {dish.description}
                    </p>
                  )}

                  {/* Category */}
                  {dish.category && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-3">
                      {dish.category}
                    </span>
                  )}

                  {/* Dietary Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {getDietaryBadges(dish).map((badge, index) => (
                      <span
                        key={index}
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          badge.color === 'green'
                            ? 'bg-green-100 text-green-700'
                            : badge.color === 'blue'
                            ? 'bg-blue-100 text-blue-700'
                            : badge.color === 'purple'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>

                  {/* Allergens */}
                  {dish.allergens && dish.allergens.length > 0 && (
                    <p className="text-xs text-red-600 mb-3">
                      ⚠️ Contains: {dish.allergens.join(', ')}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleAvailability(dish)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dish.is_available
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {dish.is_available ? (
                        <>
                          <Eye size={14} />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          <span>Unavailable</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingDish(dish);
                        setShowModal(true);
                      }}
                      className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dish Modal */}
      {showModal && (
        <AddDishModal
          restaurantId={restaurant.id}
          dish={editingDish}
          onClose={() => {
            setShowModal(false);
            setEditingDish(null);
          }}
          onSuccess={(dish) => {
            if (editingDish) {
              setDishes((prev) =>
                prev.map((d) => (d.id === dish.id ? dish : d))
              );
            } else {
              setDishes((prev) => [dish, ...prev]);
            }
            setShowModal(false);
            setEditingDish(null);
          }}
        />
      )}
    </div>
  );
}
