'use client';

import { Sparkles, Users, Heart, Star, BookMarked } from 'lucide-react';

interface WhyRecommendedProps {
  reasons: string[];
}

function getIconForReason(reason: string) {
  const lowerReason = reason.toLowerCase();

  if (lowerReason.includes('friend')) {
    return <Users className="w-3 h-3" />;
  }
  if (lowerReason.includes('bucket list')) {
    return <BookMarked className="w-3 h-3" />;
  }
  if (lowerReason.includes('highly rated')) {
    return <Star className="w-3 h-3" />;
  }
  if (lowerReason.includes('love') || lowerReason.includes('favorite')) {
    return <Heart className="w-3 h-3" />;
  }
  return <Sparkles className="w-3 h-3" />;
}

export function WhyRecommended({ reasons }: WhyRecommendedProps) {
  if (reasons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {reasons.slice(0, 2).map((reason, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e52020]/10 text-[#e52020] text-xs rounded-full"
        >
          {getIconForReason(reason)}
          {reason}
        </span>
      ))}
    </div>
  );
}
