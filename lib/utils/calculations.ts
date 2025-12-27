import type { Category } from "@/lib/data/categories";

export type Frequency = "once" | "weekly" | "monthly";

export interface RangeResult {
  low: number;
  likely: number;
  high: number;
}

export interface CalculatedResults {
  // Dollars retained in Washoe (local retention)
  retained: RangeResult;
  // Chain comparison (what would stay at a chain)
  chainRetained: number;
  // Premium over chain
  localPremium: number;
  // Total local activity supported (IO multiplier effect)
  totalImpact: number;
  // Frequency projections
  monthly?: {
    retained: RangeResult;
    chainRetained: number;
    localPremium: number;
    totalImpact: number;
  };
  yearly?: {
    retained: RangeResult;
    chainRetained: number;
    localPremium: number;
    totalImpact: number;
  };
}

/**
 * Calculate the amount kept in Washoe County based on category retention rates
 * and AI-assessed local confidence score
 * 
 * @param localConfidenceScore - 0-100 score from Grok AI (0 = definitely chain, 100 = definitely local)
 *   - If score is 0 (chain): uses chain retention rate
 *   - If score is 100 (local): uses full local retention rate
 *   - In between: interpolates between chain and local rates
 */
export function calculateKept(
  amount: number,
  category: Category,
  frequency: Frequency,
  localConfidenceScore?: number
): CalculatedResults {
  if (amount <= 0) {
    return {
      retained: { low: 0, likely: 0, high: 0 },
      chainRetained: 0,
      localPremium: 0,
      totalImpact: 0,
    };
  }

  // Normalize confidence score to 0-1 (default to 1 = fully local if not provided)
  const confidenceFactor = localConfidenceScore !== undefined 
    ? Math.max(0, Math.min(100, localConfidenceScore)) / 100 
    : 1;

  // Interpolate retention rates based on confidence score
  // At 0% confidence (chain): use chain retention
  // At 100% confidence (local): use full local retention
  const effectiveRetentionLow = category.chainRetention + 
    (category.retentionLow - category.chainRetention) * confidenceFactor;
  const effectiveRetentionLikely = category.chainRetention + 
    (category.retentionLikely - category.chainRetention) * confidenceFactor;
  const effectiveRetentionHigh = category.chainRetention + 
    (category.retentionHigh - category.chainRetention) * confidenceFactor;

  // Calculate retention based on effective rates
  const retained: RangeResult = {
    low: amount * effectiveRetentionLow,
    likely: amount * effectiveRetentionLikely,
    high: amount * effectiveRetentionHigh,
  };

  // Chain comparison (always uses baseline chain rate for comparison)
  const chainRetained = amount * category.chainRetention;
  const localPremium = retained.likely - chainRetained;

  // Calculate total local activity (IO multiplier)
  // Also factor in confidence - chains have less local economic ripple
  const effectiveMultiplier = 1 + (category.ioMultiplier - 1) * confidenceFactor;
  const totalImpact = amount * effectiveMultiplier;

  const results: CalculatedResults = {
    retained,
    chainRetained,
    localPremium,
    totalImpact,
  };

  // Calculate monthly and yearly projections based on frequency
  if (frequency === "weekly") {
    results.monthly = {
      retained: {
        low: retained.low * 4.33,
        likely: retained.likely * 4.33,
        high: retained.high * 4.33,
      },
      chainRetained: chainRetained * 4.33,
      localPremium: localPremium * 4.33,
      totalImpact: totalImpact * 4.33,
    };
    results.yearly = {
      retained: {
        low: retained.low * 52,
        likely: retained.likely * 52,
        high: retained.high * 52,
      },
      chainRetained: chainRetained * 52,
      localPremium: localPremium * 52,
      totalImpact: totalImpact * 52,
    };
  } else if (frequency === "monthly") {
    results.yearly = {
      retained: {
        low: retained.low * 12,
        likely: retained.likely * 12,
        high: retained.high * 12,
      },
      chainRetained: chainRetained * 12,
      localPremium: localPremium * 12,
      totalImpact: totalImpact * 12,
    };
  }

  return results;
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a range as currency
 */
export function formatRange(low: number, high: number): string {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
