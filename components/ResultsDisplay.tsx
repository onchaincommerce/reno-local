"use client";

import type { CalculatedResults } from "@/lib/utils/calculations";
import { formatCurrency, formatRange } from "@/lib/utils/calculations";
import type { Frequency } from "@/lib/utils/calculations";
import type { Category } from "@/lib/data/categories";

interface ResultsDisplayProps {
  results: CalculatedResults;
  frequency: Frequency;
  amount: number;
  category: Category;
  localConfidenceScore?: number;
  isChain?: boolean;
}

export function ResultsDisplay({
  results,
  frequency,
  amount,
  category,
  localConfidenceScore,
  isChain,
}: ResultsDisplayProps) {
  if (amount <= 0) {
    return null;
  }

  // Determine if this is a chain based on confidence score or explicit flag
  const isLikelyChain = isChain || (localConfidenceScore !== undefined && localConfidenceScore < 50);
  const isDefinitelyChain = isChain || (localConfidenceScore !== undefined && localConfidenceScore < 20);

  return (
    <div className="w-full space-y-5 animate-slide-up">
      {/* Chain Notice */}
      {isDefinitelyChain && (
        <div className="p-3 rounded-lg bg-strawberry/15 border border-strawberry/30">
          <p className="text-sm text-strawberry-dark font-medium">
            📊 This appears to be a national chain. Showing chain-level retention rates.
          </p>
        </div>
      )}

      {/* Primary Result - Local Retention */}
      <div className={`inner-card p-6 shadow-lg border-2 ${isLikelyChain ? 'border-strawberry/40' : 'border-kiwi/40'}`}>
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-granite">
            Stays in Washoe County
          </p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
            isLikelyChain 
              ? 'bg-strawberry/15 text-strawberry-dark' 
              : 'bg-kiwi/15 text-kiwi-dark'
          }`}>
            {isLikelyChain ? 'Chain Rate' : 'Local $'}
          </span>
        </div>
        <p className={`text-4xl font-bold mb-2 ${isLikelyChain ? 'text-strawberry-dark' : 'text-kiwi-dark'}`}>
          {formatCurrency(results.retained.likely)}
        </p>
        <p className="text-sm text-granite/70">
          Range: {formatRange(results.retained.low, results.retained.high)}
        </p>
      </div>

      {/* Chain Comparison */}
      <div className="inner-card rounded-organic p-4 border-2 border-kiwi/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-granite mb-1">
              vs. National Chain
            </p>
            <p className="text-lg font-bold text-kiwi-dark">
              +{formatCurrency(results.localPremium)} more local
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-granite">Chain keeps</p>
            <p className="text-sm font-bold text-strawberry-dark">
              {formatCurrency(results.chainRetained)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Economic Impact */}
      <div className="inner-card p-4 border-2 border-strawberry/30">
        <p className="text-xs font-medium text-granite mb-1">
          Total Local Activity Supported
        </p>
        <p className="text-2xl font-bold text-strawberry-dark">
          {formatCurrency(results.totalImpact)}
        </p>
        <p className="text-xs text-granite/70 mt-1">
          {category.ioMultiplier}x multiplier (IMPLAN Washoe County)
        </p>
      </div>

      {/* Frequency Projections */}
      {frequency === "weekly" && results.monthly && results.yearly && (
        <div className="grid grid-cols-2 gap-3">
          <div className="inner-card p-4 border border-kiwi/20">
            <p className="text-xs text-granite mb-1">Per Month</p>
            <p className="text-xl font-bold text-charcoal">
              {formatCurrency(results.monthly.retained.likely)}
            </p>
            <p className="text-xs text-kiwi-dark font-semibold mt-1">
              +{formatCurrency(results.monthly.localPremium)} vs chain
            </p>
          </div>
          <div className="inner-card p-4 border border-kiwi/20">
            <p className="text-xs text-granite mb-1">Per Year</p>
            <p className="text-xl font-bold text-charcoal">
              {formatCurrency(results.yearly.retained.likely)}
            </p>
            <p className="text-xs text-kiwi-dark font-semibold mt-1">
              +{formatCurrency(results.yearly.localPremium)} vs chain
            </p>
          </div>
        </div>
      )}

      {frequency === "monthly" && results.yearly && (
        <div className="inner-card p-4 border border-kiwi/20">
          <p className="text-xs text-granite mb-1">Per Year</p>
          <p className="text-xl font-bold text-charcoal">
            {formatCurrency(results.yearly.retained.likely)}
          </p>
          <p className="text-xs text-kiwi-dark font-semibold mt-1">
            +{formatCurrency(results.yearly.localPremium)} vs chain
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="pt-1">
        <p className="text-xs text-white/60 leading-relaxed">
          Based on Civic Economics studies and Washoe County IMPLAN data. Actual retention varies by business.
        </p>
      </div>
    </div>
  );
}
