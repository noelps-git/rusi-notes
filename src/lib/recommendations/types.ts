export interface ScoredRecommendation {
  restaurant_id: string;
  similarity_score: number;
  boost_score: number;
  final_score: number;
  reasons: string[];
}

export interface RestaurantMatch {
  restaurant_id: string;
  name: string;
  description: string | null;
  similarity: number;
  categories: string[];
  price_range: string | null;
  average_rating: number;
  total_reviews: number;
  logo_url: string | null;
  city: string;
}

export interface RecommendationOptions {
  limit?: number;
  excludeVisited?: boolean;
  categoryFilter?: string[];
  priceFilter?: string[];
}

export interface FriendReview {
  restaurant_id: string;
  friend_count: number;
  avg_rating: number;
}

export interface RecommendationWithRestaurant extends ScoredRecommendation {
  restaurant: {
    id: string;
    name: string;
    description: string | null;
    categories: string[];
    price_range: string | null;
    average_rating: number;
    total_reviews: number;
    logo_url: string | null;
    city: string;
  } | null;
}
