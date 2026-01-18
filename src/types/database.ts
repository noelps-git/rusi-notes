export type UserRole = 'user' | 'business' | 'admin';
export type NotificationType = 'all' | 'new_follower' | 'follow_request' | 'shared_note' | 'comment' | 'like' | 'group_invite' | 'group_message';
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';
export type DietaryPreference = 'vegetarian' | 'vegan' | 'non_veg' | 'eggetarian' | 'jain' | 'halal';
export type AdStatus = 'draft' | 'active' | 'paused' | 'completed';
export type RestaurantCategory = 'south_indian' | 'north_indian' | 'chinese' | 'continental' | 'fast_food' | 'bakery' | 'cafe' | 'street_food' | 'biryani' | 'chettinad' | 'seafood' | 'desserts';

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  categories: RestaurantCategory[];
  address: string;
  city: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website_url?: string;
  logo_url?: string;
  cover_image_url?: string;
  average_rating: number;
  total_reviews: number;
  price_range?: string;
  opening_hours?: Record<string, string>;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  image_url?: string;
  dietary_info?: DietaryPreference[];
  allergens?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TastingNote {
  id: string;
  user_id: string;
  restaurant_id?: string;
  dish_id?: string;
  title: string;
  content: string;
  rating?: number;
  images?: string[];
  tags?: string[];
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  avatar_url?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface AdCampaign {
  id: string;
  business_id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  target_audience?: Record<string, any>;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  status: AdStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}
