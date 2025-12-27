"use client";

import { useState, useEffect } from "react";
import { categories, getCategoryByKey, getDefaultCategory } from "@/lib/data/categories";
import { calculateKept, type Frequency } from "@/lib/utils/calculations";
import { getCategoryFromPlaceTypes } from "@/lib/utils/place-category-mapper";
import { CategorySelector } from "./CategorySelector";
import { AmountInput } from "./AmountInput";
import { FrequencyToggle } from "./FrequencyToggle";
import { ResultsDisplay } from "./ResultsDisplay";
import { ShareButton } from "./ShareButton";
import { InfoModal } from "./InfoModal";
import type { SelectedPlace } from "@/lib/types/places";

interface CalculatorProps {
  initialCategory?: string;
  initialAmount?: number;
  initialFrequency?: Frequency;
  isSharedView?: boolean;
  onEdit?: () => void;
  selectedPlace?: SelectedPlace | null;
  suggestedCategory?: string;
  localConfidenceScore?: number;
  isChain?: boolean;
  isResearchComplete?: boolean;
}

export function Calculator({
  initialCategory,
  initialAmount,
  initialFrequency,
  isSharedView = false,
  onEdit,
  selectedPlace,
  suggestedCategory,
  localConfidenceScore,
  isChain,
  isResearchComplete = true,
}: CalculatorProps) {
  const defaultCategory = getDefaultCategory();
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ? getCategoryByKey(initialCategory) || defaultCategory : defaultCategory
  );
  const [amount, setAmount] = useState(initialAmount ?? 0);
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency ?? "once");

  // Update category if initialCategory changes (from URL params)
  useEffect(() => {
    if (initialCategory) {
      const category = getCategoryByKey(initialCategory);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [initialCategory]);

  // Auto-select category based on selected place's types (fallback)
  useEffect(() => {
    if (selectedPlace?.types && !suggestedCategory) {
      const mappedCategory = getCategoryFromPlaceTypes(selectedPlace.types);
      if (mappedCategory) {
        setSelectedCategory(mappedCategory);
      }
    }
  }, [selectedPlace, suggestedCategory]);

  // Use AI-suggested category when available (priority)
  useEffect(() => {
    if (suggestedCategory) {
      const category = getCategoryByKey(suggestedCategory);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [suggestedCategory]);

  // Calculate results - pass confidence score to adjust retention rates
  // If it's a chain (low confidence), the retention will be closer to chain rates
  const results = calculateKept(amount, selectedCategory, frequency, localConfidenceScore);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header - only show if no selectedPlace (place info shown separately) */}
      {!selectedPlace && (
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <img src="/rld_logo.png" alt="Reno Local Dollars" className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl" />
          </div>
          {/* Title - clean white */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wide drop-shadow-lg"
            style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              color: 'white'
            }}
          >
            Reno Local Dollars
          </h1>
          <p className="text-lg font-semibold text-white/90 drop-shadow">
            See how much stays in Washoe County when you shop local
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <InfoModal />
          </div>
        </div>
      )}

      {/* Edit button for shared view */}
      {isSharedView && onEdit && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-organic text-sm font-medium bg-card-bg border border-border hover:border-primary/30 transition-colors"
          >
            Edit
          </button>
        </div>
      )}

      {/* Calculator Form */}
      <div className="glass-card rounded-organic p-6 sm:p-8 card-shadow space-y-6">
        {/* Show waiting state when research is in progress */}
        {selectedPlace && !isResearchComplete ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10">
              <div className="w-5 h-5 border-2 border-white/30 border-t-strawberry rounded-full animate-spin" />
              <p className="text-white/90">Analyzing business...</p>
            </div>
            <p className="text-white/60 text-sm mt-3">
              Getting local ownership details and category
            </p>
          </div>
        ) : (
          <>
            <CategorySelector
              categories={categories}
              selectedKey={selectedCategory.key}
              onSelect={(key) => {
                const category = getCategoryByKey(key);
                if (category) {
                  setSelectedCategory(category);
                }
              }}
            />

            <AmountInput value={amount} onChange={setAmount} />

            <FrequencyToggle value={frequency} onChange={setFrequency} />

            {/* Results */}
            {amount > 0 && (
              <div className="pt-4 border-t border-white/20">
                <ResultsDisplay
                  results={results}
                  frequency={frequency}
                  amount={amount}
                  category={selectedCategory}
                  localConfidenceScore={localConfidenceScore}
                  isChain={isChain}
                />
              </div>
            )}

            {/* Actions */}
            {amount > 0 && (
              <div className="pt-4 border-t border-white/20 space-y-3">
            <ShareButton
              category={selectedCategory}
              amount={amount}
              frequency={frequency}
              results={results}
              placeName={selectedPlace?.displayName}
              googleMapsUri={selectedPlace?.googleMapsUri}
            />
                <button
                  type="button"
                  onClick={() => {
                    setAmount(0);
                    setSelectedCategory(defaultCategory);
                    setFrequency("once");
                  }}
                  className="w-full px-6 py-3 rounded-organic bg-white/20 border border-white/30 text-white font-medium hover:bg-white/30 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

