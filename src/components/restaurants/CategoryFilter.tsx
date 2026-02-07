'use client';

import { CHENNAI_RESTAURANT_CATEGORIES } from '@/lib/constants/chennai';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-[#999999] mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-[100px] text-sm font-medium transition-all ${
            selected === null
              ? 'bg-[#e52020] text-white'
              : 'bg-[#1E1E1E] text-[#999999] border border-[#333333] hover:border-[#e52020] hover:text-white'
          }`}
        >
          All Restaurants
        </button>
        {CHENNAI_RESTAURANT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`px-4 py-2 rounded-[100px] text-sm font-medium transition-all flex items-center gap-2 ${
              selected === category.id
                ? 'bg-[#e52020] text-white'
                : 'bg-[#1E1E1E] border border-[#333333] text-[#999999] hover:border-[#e52020] hover:text-white'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
