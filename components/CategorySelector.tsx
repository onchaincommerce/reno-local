"use client";

import type { Category } from "@/lib/data/categories";

interface CategorySelectorProps {
  categories: Category[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function CategorySelector({
  categories,
  selectedKey,
  onSelect,
}: CategorySelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-3 text-white">
        What are you buying?
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {categories.map((category) => {
          const isSelected = category.key === selectedKey;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => onSelect(category.key)}
              className={`
                px-3 py-3 rounded-organic text-sm font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? "category-active"
                    : "bg-white/90 text-charcoal border border-white/30 hover:bg-white hover:shadow-sm"
                }
              `}
              aria-pressed={isSelected}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
