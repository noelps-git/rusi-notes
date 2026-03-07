# AI-Powered Restaurant Recommendations - PRD

## Product Overview

An intelligent recommendation engine that learns from user behavior (reviews, ratings, preferences) to suggest personalized restaurants. Built with OpenAI embeddings and Supabase pgvector for semantic similarity search.

---

## End-to-End Flow

### 1. Data Collection (Passive)

```
User Activity
    │
    ├── Creates Tasting Note (review)
    │   └── Captures: restaurant, rating, tags, content
    │
    ├── Submits Dish Feedback
    │   └── Captures: dish rating, flavor tags
    │
    ├── Adds to Bucket List
    │   └── Captures: intent to visit
    │
    └── Sets Profile Preferences
        └── Captures: dietary preferences, allergies
```

**Data Points Used:**
- Restaurant categories reviewed (South Indian, Chinese, etc.)
- Average rating given (strict vs generous reviewer)
- Tags used frequently (spicy, authentic, cozy, etc.)
- Price ranges preferred
- Dietary restrictions
- Friend activity (social proof)

---

### 2. Embedding Generation

#### Restaurant Profile Embedding

When a restaurant is created or receives reviews:

```
Restaurant Data
    │
    ├── Name: "Saravana Bhavan"
    ├── Description: "Authentic South Indian vegetarian cuisine"
    ├── Categories: [south_indian, vegetarian]
    ├── Price Range: "$$"
    ├── Average Rating: 4.5
    ├── City: "Chennai"
    ├── Top Tags (from reviews): [crispy, authentic, quick service]
    └── Popular Dishes: [Masala Dosa, Filter Coffee, Idli]
            │
            ▼
    Build Text Profile
            │
            ▼
    "Restaurant: Saravana Bhavan. Description: Authentic South
    Indian vegetarian cuisine. Cuisine: south_indian, vegetarian.
    Price: $$. Rating: 4.5/5. Location: Chennai. Known for: crispy,
    authentic, quick service. Popular dishes: Masala Dosa, Filter
    Coffee, Idli."
            │
            ▼
    OpenAI text-embedding-3-small
            │
            ▼
    1536-dimensional vector stored in `restaurant_embeddings` table
```

#### User Taste Profile Embedding

When user creates a review or updates preferences:

```
User Activity (last 50 reviews)
    │
    ├── Favorite Categories: {south_indian: 12, biryani: 8, cafe: 5}
    ├── Average Rating Given: 4.2
    ├── Preferred Price: "$$"
    ├── Dietary: [vegetarian]
    ├── Top Tags Used: [spicy, authentic, great service]
    ├── Recent Favorites: [Saravana Bhavan, Murugan Idli Shop]
    └── Allergies: [peanuts]
            │
            ▼
    Build Taste Profile Text
            │
            ▼
    "Preferred cuisines: south_indian, biryani, cafe. Typical
    rating style: positive reviewer, appreciates good experiences.
    Price preference: $$. Diet: vegetarian. Enjoys: spicy,
    authentic, great service. Recently loved: Saravana Bhavan,
    Murugan Idli Shop. Avoids: peanuts."
            │
            ▼
    OpenAI text-embedding-3-small
            │
            ▼
    1536-dimensional vector stored in `user_taste_profiles` table
```

---

### 3. Recommendation Generation

When user visits dashboard or `/api/recommendations`:

```
Step 1: Fetch User's Taste Profile
    │
    └── SELECT embedding FROM user_taste_profiles WHERE user_id = ?
            │
            ▼
Step 2: Vector Similarity Search (pgvector)
    │
    └── Find restaurants with similar embeddings using cosine distance
    │
    │   SQL: 1 - (user_embedding <=> restaurant_embedding) > 0.3
    │
    │   Returns: [{restaurant_id, similarity: 0.85}, ...]
            │
            ▼
Step 3: Apply Scoring Boosts
    │
    ├── Friend reviewed & loved (+0.15)
    │   └── "Loved by 3 friends"
    │
    ├── High rating (+0.10)
    │   └── "Highly rated (4.5+)"
    │
    ├── On bucket list (+0.20)
    │   └── "On your bucket list"
    │
    └── Calculate final_score = similarity + boosts
            │
            ▼
Step 4: Generate "Why Recommended" Reasons
    │
    ├── similarity > 0.8 → "Matches your taste perfectly"
    ├── similarity > 0.6 → "Similar to places you love"
    ├── friend_boost → "Loved by X friend(s)"
    └── bucket_list → "On your bucket list"
            │
            ▼
Step 5: Return Sorted Results
    │
    └── Top 6-10 restaurants with reasons
```

---

### 4. Cold Start Handling

For new users with no reviews:

```
No Taste Profile Exists
    │
    ▼
Fallback Strategy
    │
    ├── Check dietary preferences from profile
    │   └── Filter restaurants accordingly
    │
    ├── Check bucket list
    │   └── Prioritize restaurants user wants to visit
    │
    ├── Get highly-rated restaurants
    │   └── ORDER BY average_rating DESC, total_reviews DESC
    │
    └── Apply basic scoring
        ├── Rating boost: (rating / 5) * 0.2
        ├── Bucket list boost: +0.3
        └── Popular boost: +0.05 (if 10+ reviews)
            │
            ▼
    Return "Popular in your area" recommendations
```

---

### 5. UI Display

```
Dashboard
    │
    └── RecommendationList Component
            │
            ├── Header: "Recommended for You" with refresh button
            │
            ├── Loading State: Spinner
            │
            ├── Empty State: "Start reviewing to get recommendations!"
            │
            └── Grid of RecommendationCards
                    │
                    ├── Restaurant Image
                    ├── Name & Category
                    ├── Rating & Review Count
                    └── WhyRecommended Badges
                        ├── "Matches your taste perfectly"
                        ├── "Loved by 2 friends"
                        └── "On your bucket list"
```

---

## Database Schema

### Tables

```sql
-- Restaurant embeddings (1 per restaurant)
restaurant_embeddings
├── id (UUID)
├── restaurant_id (FK → restaurants)
├── embedding (vector[1536])
├── embedding_text (TEXT) -- for debugging
├── created_at
└── updated_at

-- User taste profiles (1 per user)
user_taste_profiles
├── id (UUID)
├── user_id (FK → users)
├── embedding (vector[1536])
├── embedding_text (TEXT)
├── review_count (INT)
├── last_activity_at
├── created_at
└── updated_at

-- Recommendation cache (optional, for performance)
recommendation_cache
├── id (UUID)
├── user_id (FK → users)
├── recommendations (JSONB)
├── generated_at
└── expires_at (1 hour TTL)
```

### Key SQL Function

```sql
match_restaurants_by_taste(
  query_embedding,    -- User's taste profile vector
  match_threshold,    -- Minimum similarity (0.3)
  match_count,        -- Max results (30)
  p_user_id,          -- For excluding visited
  exclude_visited     -- Boolean
)
RETURNS TABLE (restaurant_id, name, similarity, categories, ...)
```

---

## API Endpoints

### GET /api/recommendations

**Request:**
```
GET /api/recommendations?limit=10&excludeVisited=true
```

**Response:**
```json
{
  "recommendations": [
    {
      "restaurant_id": "uuid",
      "similarity_score": 0.82,
      "boost_score": 0.15,
      "final_score": 0.97,
      "reasons": ["Matches your taste perfectly", "Loved by 2 friends"],
      "restaurant": {
        "id": "uuid",
        "name": "Saravana Bhavan",
        "categories": ["south_indian"],
        "average_rating": 4.5,
        "price_range": "$$",
        "logo_url": "...",
        "city": "Chennai"
      }
    }
  ],
  "meta": {
    "count": 6,
    "hasMore": true
  }
}
```

### POST /api/recommendations/refresh

Regenerates user's taste profile embedding.

**Response:**
```json
{
  "success": true,
  "message": "Taste profile updated successfully"
}
```

---

## Embedding Update Triggers

| Event | Action | Priority |
|-------|--------|----------|
| User creates tasting note | Regenerate user profile | High |
| User submits dish feedback | Regenerate user profile | High |
| User updates dietary prefs | Regenerate user profile | Medium |
| Restaurant gets 5th review | Regenerate restaurant profile | Medium |
| Weekly cron job | Batch regenerate all | Low |

---

## File Structure

```
src/
├── lib/
│   ├── ai/
│   │   ├── openai.ts          # OpenAI client
│   │   ├── embeddings.ts      # Generate embeddings
│   │   └── types.ts
│   └── recommendations/
│       ├── index.ts           # Exports
│       ├── restaurant-profile.ts
│       ├── user-profile.ts
│       ├── scoring.ts         # Main recommendation logic
│       ├── cold-start.ts
│       └── types.ts
├── app/api/recommendations/
│   ├── route.ts               # GET recommendations
│   └── refresh/route.ts       # POST refresh profile
└── components/recommendations/
    ├── RecommendationList.tsx
    ├── RecommendationCard.tsx
    └── WhyRecommended.tsx

supabase/migrations/
└── 007_vector_embeddings.sql  # pgvector setup
```

---

## Configuration Required

### Environment Variables

```bash
OPENAI_API_KEY=sk-...
```

### Supabase Setup

1. Enable pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. Run migration `007_vector_embeddings.sql`

3. Generate initial embeddings for existing restaurants

---

## Cost Estimation

### OpenAI Embeddings (text-embedding-3-small)

- Cost: $0.02 per 1M tokens
- Average text length: ~200 tokens

| Activity | Frequency | Monthly Cost |
|----------|-----------|--------------|
| 1000 restaurant profiles | One-time | $0.004 |
| 500 user profiles/day | Daily | $0.06/month |
| Profile updates | Per review | Negligible |

**Estimated monthly cost: < $1** for typical usage

---

## Performance Considerations

1. **IVFFlat Index**: Approximate nearest neighbor search for fast queries
2. **Cache Layer**: 1-hour TTL on recommendations
3. **Lazy Updates**: Don't block user actions; update embeddings async
4. **Batch Processing**: Generate embeddings in batches of 100

---

## Future Enhancements

### Phase 2
- Dish-level recommendations ("You might like the Butter Chicken here")
- Occasion matching (date night, family dinner, quick lunch)
- Time-based recommendations (lunch spots, dinner places)

### Phase 3
- Collaborative filtering (users with similar taste)
- Trending restaurants in your network
- "Friends are going" feature

### Phase 4
- Review sentiment analysis
- Fake review detection
- Quality trend tracking (is this restaurant getting worse?)
