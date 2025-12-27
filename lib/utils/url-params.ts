import type { Frequency } from "./calculations";

export interface UrlParams {
  category?: string;
  amount?: number;
  frequency?: Frequency;
}

/**
 * Parse URL query parameters
 */
export function parseUrlParams(searchParams: URLSearchParams): UrlParams {
  const category = searchParams.get("c") || undefined;
  const amountStr = searchParams.get("a");
  const frequency = searchParams.get("f") as Frequency | null;

  let amount: number | undefined;
  if (amountStr) {
    const parsed = parseFloat(amountStr);
    amount = isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }

  return {
    category,
    amount,
    frequency: frequency && ["once", "weekly", "monthly"].includes(frequency) 
      ? frequency 
      : undefined,
  };
}

/**
 * Generate shareable URL from current state
 */
export function generateShareUrl(
  category: string,
  amount: number,
  frequency: Frequency
): string {
  const params = new URLSearchParams();
  params.set("c", category);
  params.set("a", amount.toFixed(2));
  params.set("f", frequency);

  return `/r?${params.toString()}`;
}

/**
 * Get full shareable URL (with origin)
 */
export function getFullShareUrl(
  category: string,
  amount: number,
  frequency: Frequency
): string {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}${generateShareUrl(category, amount, frequency)}`;
}

