"use client";

import type { CalculatedResults } from "@/lib/utils/calculations";
import { formatCurrency } from "@/lib/utils/calculations";
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
  
  // Calculate what a true local business would retain (for chain comparison)
  const trueLocalRetention = amount * category.retentionLikely;
  
  // Determine which way to show the comparison
  const showingLocalBusiness = !isLikelyChain;

  return (
    <div className="w-full space-y-4 animate-slide-up">
      {/* Three Card Impact Display */}
      <div className="space-y-3">
        
        {/* Card 1: Local Option */}
        <div className="inner-card p-5 shadow-lg border-2 border-kiwi/50">
          <p className="text-xs font-semibold text-kiwi-dark uppercase tracking-wide mb-2">
            {showingLocalBusiness ? "Local Option" : "Local Alternative"}
          </p>
          <p className="text-3xl font-bold text-kiwi-dark mb-1">
            {formatCurrency(showingLocalBusiness ? results.retained.likely : trueLocalRetention)}
          </p>
          <p className="text-sm text-granite">
            stays in the local economy
          </p>
        </div>

        {/* Card 2: Chain Equivalent */}
        <div className="inner-card p-5 shadow-lg border-2 border-strawberry/50">
          <p className="text-xs font-semibold text-strawberry-dark uppercase tracking-wide mb-2">
            {showingLocalBusiness ? "Chain Equivalent" : "This Chain"}
          </p>
          <p className="text-3xl font-bold text-strawberry-dark mb-1">
            {formatCurrency(showingLocalBusiness ? results.chainRetained : results.retained.likely)}
          </p>
          <p className="text-sm text-granite">
            stays in the local economy
          </p>
        </div>

        {/* Card 3: Net Difference - Pink with glow/pulse */}
        <div 
          className="p-5 rounded-2xl border-2 border-strawberry-light animate-pulse-glow"
          style={{ 
            background: 'linear-gradient(135deg, #E8919A, #D4747E)',
            boxShadow: '0 0 20px rgba(232, 145, 154, 0.5), 0 0 40px rgba(232, 145, 154, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.1)'
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-white/90">
            {showingLocalBusiness ? "Your Impact" : "If You Switched"}
          </p>
          <p className="text-3xl font-bold mb-1 text-white">
            +{formatCurrency(showingLocalBusiness ? results.localPremium : (trueLocalRetention - results.retained.likely))}
          </p>
          <p className="text-sm text-white/80">
            {showingLocalBusiness 
              ? "more stays local vs. a chain" 
              : "more would stay local"}
          </p>
        </div>
      </div>

      {/* Total Economic Impact - smaller */}
      <div className="inner-card p-4 border border-granite/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-granite">
              Total Local Activity Supported
            </p>
            <p className="text-xs text-granite/60">
              {category.ioMultiplier}x IMPLAN multiplier
            </p>
          </div>
          <p className="text-xl font-bold text-charcoal">
            {formatCurrency(results.totalImpact)}
          </p>
        </div>
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
