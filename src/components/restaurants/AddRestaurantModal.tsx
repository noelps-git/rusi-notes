'use client';

import { useState } from 'react';
import { X, MapPin, Store, Loader2, Check } from 'lucide-react';

// Valid category values from database enum
const CATEGORIES = [
  { value: 'south_indian', label: 'South Indian' },
  { value: 'north_indian', label: 'North Indian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'continental', label: 'Continental' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'street_food', label: 'Street Food' },
  { value: 'biryani', label: 'Biryani' },
  { value: 'chettinad', label: 'Chettinad' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'desserts', label: 'Desserts' },
];

type AddRestaurantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (restaurant: { id: string; name: string; address: string }) => void;
};

export function AddRestaurantModal({ isOpen, onClose, onSuccess }: AddRestaurantModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Restaurant name is required');
      return;
    }

    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/restaurants/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          city: city.trim(),
          categories: selectedCategories,
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add restaurant');
      }

      // Success - pass the new restaurant back
      onSuccess(data.restaurant);

      // Reset form
      setName('');
      setAddress('');
      setCity('Chennai');
      setSelectedCategories([]);
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to add restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e52020]/10 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5 text-[#e52020]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add New Restaurant</h2>
              <p className="text-sm text-gray-500">Can't find your spot? Add it here!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Saravana Bhavan"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e52020] focus:ring-1 focus:ring-[#e52020] transition-all"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., CTH Road, Avadi"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e52020] focus:ring-1 focus:ring-[#e52020] transition-all"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Chennai"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e52020] focus:ring-1 focus:ring-[#e52020] transition-all"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes(cat.value)
                      ? 'bg-[#e52020] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {selectedCategories.includes(cat.value) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the restaurant..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e52020] focus:ring-1 focus:ring-[#e52020] transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#e52020] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Restaurant'
              )}
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-400 text-center">
            Your submission will be reviewed by our team for verification.
          </p>
        </form>
      </div>
    </div>
  );
}
