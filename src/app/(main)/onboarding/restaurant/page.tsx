'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MapPin, Building2, FileText, CheckSquare, Square } from 'lucide-react';

const CHENNAI_CATEGORIES = [
  { id: 'south_indian', label: 'South Indian', icon: '🍛' },
  { id: 'north_indian', label: 'North Indian', icon: '🍜' },
  { id: 'chettinad', label: 'Chettinad', icon: '🌶️' },
  { id: 'seafood', label: 'Seafood', icon: '🦐' },
  { id: 'biryani', label: 'Biryani', icon: '🍚' },
  { id: 'chinese', label: 'Chinese', icon: '🥢' },
  { id: 'continental', label: 'Continental', icon: '🍽️' },
  { id: 'fast_food', label: 'Fast Food', icon: '🍔' },
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'bakery', label: 'Bakery', icon: '🥐' },
  { id: 'street_food', label: 'Street Food', icon: '🌮' },
  { id: 'desserts', label: 'Desserts', icon: '🍨' },
];

export default function RestaurantOnboardingPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [priceRange, setPriceRange] = useState('₹₹');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    } else if (isSignedIn && (user?.publicMetadata as any)?.role !== 'business') {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, user, router]);

  const toggleCategory = (categoryId: string) => {
    if (categories.includes(categoryId)) {
      setCategories(categories.filter((c) => c !== categoryId));
    } else {
      setCategories([...categories, categoryId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Comprehensive validation for all mandatory fields
    if (!name.trim()) {
      setError('Restaurant name is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (categories.length === 0) {
      setError('Please select at least one category');
      return;
    }
    if (!address.trim()) {
      setError('Address is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!gstNumber.trim()) {
      setError('GST number is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          categories,
          address: address.trim(),
          city,
          phone: phone.trim(),
          email: email.trim(),
          website: website.trim() || null,
          gst_number: gstNumber.trim(),
          price_range: priceRange,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create restaurant');
      }

      // Success! Show celebration
      setSuccess(true);

      // Redirect after animation
      setTimeout(() => {
        router.push('/business/dashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create restaurant');
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Success celebration overlay
  if (success) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50 overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
            </div>
          ))}
        </div>

        {/* Success content */}
        <div className="relative z-10 text-center px-4 animate-scale-in">
          {/* Checkmark circle */}
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce-in shadow-2xl">
            <svg
              className="w-16 h-16 text-green-500 animate-check-draw"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success message */}
          <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-2xl text-white/90 mb-2 animate-slide-up animation-delay-200">
            Your restaurant has been submitted!
          </p>
          <p className="text-lg text-white/80 animate-slide-up animation-delay-400">
            We're reviewing your application and will notify you soon.
          </p>

          {/* Redirecting message */}
          <div className="mt-8 animate-fade-in animation-delay-600">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-4">
            <Building2 size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Register Your Restaurant
          </h1>
          <p className="text-gray-600">
            Let's get your restaurant listed on Taste
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your restaurant..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories <span className="text-red-500">*</span>
                <span className="text-gray-400 text-xs ml-2">
                  (Select all that apply)
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CHENNAI_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center justify-between px-4 py-3 border-2 rounded-lg transition-all ${
                      categories.includes(category.id)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </div>
                    {categories.includes(category.id) ? (
                      <CheckSquare size={18} className="text-indigo-600" />
                    ) : (
                      <Square size={18} className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, landmark, area"
                  rows={2}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50"
                readOnly
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 44 1234 5678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@restaurant.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourrestaurant.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number <span className="text-red-500">*</span>
                <span className="text-gray-400 text-xs ml-2">
                  (For verification purposes)
                </span>
              </label>
              <div className="relative">
                <FileText
                  size={20}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="29XXXXX1234X1Z5"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Your GST number is kept private and used only for verification
              </p>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-3">
                {['₹', '₹₹', '₹₹₹'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setPriceRange(range)}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                      priceRange === range
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                ₹ = Budget-friendly • ₹₹ = Moderate • ₹₹₹ = Premium
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your restaurant will be reviewed by our
                team before being published. You'll receive a notification once
                it's approved (usually within 24-48 hours).
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
