'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Star, Upload, X, Tag as TagIcon } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

type Restaurant = {
  id: string;
  name: string;
  categories: string[];
  address: string;
};

type Dish = {
  id: string;
  name: string;
  restaurant_id: string;
};

export default function CreateNotePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loadingDishes, setLoadingDishes] = useState(false);

  // Form state
  const [restaurantId, setRestaurantId] = useState('');
  const [dishId, setDishId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fetch dishes when restaurant changes
  useEffect(() => {
    if (restaurantId) {
      fetchDishes(restaurantId);
    } else {
      setDishes([]);
      setDishId('');
    }
  }, [restaurantId]);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const fetchDishes = async (restaurantId: string) => {
    setLoadingDishes(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setDishes(data.dishes || []);
      }
    } catch (err) {
      console.error('Error fetching dishes:', err);
    } finally {
      setLoadingDishes(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImages((prev) => [...prev, base64]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurantId || null,
          dish_id: dishId || null,
          title,
          content,
          rating,
          images,
          tags,
          is_public: isPublic,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create note');
      }

      showToast('Review published successfully!', 'success');
      router.push(`/notes/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create tasting note');
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#00B14F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Share Your Tasting Experience 🍛
          </h1>
          <p className="text-[#999999]">
            Document your culinary journey and share it with food lovers
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Restaurant Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Restaurant <span className="text-[#666666]">(Optional)</span>
              </label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-[100px] text-white focus:outline-none focus:border-[#00B14F] transition-all [&>option]:bg-[#2A2A2A] [&>option]:text-white"
              >
                <option value="" className="text-[#666666]">Select a restaurant...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id} className="text-white">
                    {restaurant.name} - {restaurant.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Dish Selection */}
            {restaurantId && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Dish <span className="text-[#666666]">(Optional)</span>
                </label>
                {loadingDishes ? (
                  <div className="text-[#999999]">Loading dishes...</div>
                ) : dishes.length > 0 ? (
                  <select
                    value={dishId}
                    onChange={(e) => setDishId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-[100px] text-white focus:outline-none focus:border-[#00B14F] transition-all [&>option]:bg-[#2A2A2A] [&>option]:text-white"
                  >
                    <option value="" className="text-[#666666]">Select a dish...</option>
                    {dishes.map((dish) => (
                      <option key={dish.id} value={dish.id} className="text-white">
                        {dish.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-[#666666] text-sm">
                    No dishes available for this restaurant
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Amazing Filter Coffee Experience"
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-[100px] text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-[#333333]'
                      } transition-colors`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-[#999999]">
                    {rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Review <span className="text-red-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience... What did you love? What flavors stood out? Would you recommend it?"
                rows={6}
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#333333] rounded-2xl text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Photos <span className="text-[#666666]">(Optional)</span>
              </label>
              <div className="space-y-4">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#333333] rounded-lg cursor-pointer hover:border-[#00B14F] transition-colors">
                  <Upload size={20} className="mr-2 text-[#666666]" />
                  <span className="text-[#999999]">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tags <span className="text-[#666666]">(Optional)</span>
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags (e.g., spicy, sweet, must-try)"
                    className="flex-1 px-4 py-2 bg-[#2A2A2A] border border-[#333333] rounded-[100px] text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#00B14F]/20 text-[#00B14F] rounded-lg hover:bg-[#00B14F]/30 transition-colors border border-[#00B14F]/30"
                  >
                    Add
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#00B14F]/20 text-[#00B14F] rounded-full text-sm border border-[#00B14F]/30"
                      >
                        <TagIcon size={14} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg border border-[#333333]">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Public Note
                </h3>
                <p className="text-sm text-[#666666]">
                  Make this note visible to everyone
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublic ? 'bg-[#00B14F]' : 'bg-[#333333]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-[#333333] text-white rounded-[100px] hover:bg-[#2A2A2A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#00B14F] text-white rounded-[100px] font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : 'Publish Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
