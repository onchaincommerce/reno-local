export interface Category {
  key: string;
  name: string;
  // Local retention rates (Civic Economics studies)
  retentionLow: number;    // 0-1
  retentionLikely: number;  // 0-1
  retentionHigh: number;   // 0-1
  // Chain retention for comparison
  chainRetention: number;   // 0-1
  // Washoe County IO multiplier (total activity per $1 direct)
  ioMultiplier: number;
  description: string;
}

// Washoe County sales tax rate
export const WASHOE_SALES_TAX_RATE = 0.08265;

export const categories: Category[] = [
  {
    key: "coffee",
    name: "Coffee / Cafe",
    retentionLow: 0.65,
    retentionLikely: 0.72,
    retentionHigh: 0.79,
    chainRetention: 0.30,
    ioMultiplier: 1.21, // Food & Beverage
    description: "Local cafes retain 65-79% locally vs ~30% at chains. Based on Civic Economics studies of local wages, rent, suppliers, and ownership."
  },
  {
    key: "quick-meal",
    name: "Quick Meal (Burrito / Sandwich)",
    retentionLow: 0.65,
    retentionLikely: 0.72,
    retentionHigh: 0.79,
    chainRetention: 0.30,
    ioMultiplier: 1.21, // Food & Beverage
    description: "Local quick-service restaurants keep 65-79% in Washoe vs ~30% at national chains."
  },
  {
    key: "restaurant-dinner",
    name: "Restaurant Dinner",
    retentionLow: 0.68,
    retentionLikely: 0.74,
    retentionHigh: 0.79,
    chainRetention: 0.30,
    ioMultiplier: 1.21, // Food & Beverage (can use 1.56 for optimistic Reno MSA)
    description: "Full-service local restaurants retain 68-79% locally through staff wages, local suppliers, and ownership vs ~30% at chains."
  },
  {
    key: "bar-brewery",
    name: "Bar / Brewery",
    retentionLow: 0.68,
    retentionLikely: 0.74,
    retentionHigh: 0.79,
    chainRetention: 0.30,
    ioMultiplier: 1.21, // Food & Beverage
    description: "Local bars and breweries keep 68-79% in the community vs ~30% at national chains."
  },
  {
    key: "local-retail",
    name: "Local Retail / Thrift",
    retentionLow: 0.52,
    retentionLikely: 0.54,
    retentionHigh: 0.56,
    chainRetention: 0.14,
    ioMultiplier: 1.17, // Retail Trade
    description: "Local retailers retain 52-56% locally vs only ~14% at chain retailers. Major difference in where profits go."
  },
  {
    key: "personal-services",
    name: "Personal Services (Hair / Nails / Tattoo)",
    retentionLow: 0.70,
    retentionLikely: 0.78,
    retentionHigh: 0.85,
    chainRetention: 0.35,
    ioMultiplier: 1.21, // Similar to Food & Beverage (service-based)
    description: "Personal service businesses are often locally owned with local staff, resulting in 70-85% local retention."
  },
  {
    key: "local-groceries",
    name: "Local Groceries / Market",
    retentionLow: 0.52,
    retentionLikely: 0.54,
    retentionHigh: 0.56,
    chainRetention: 0.14,
    ioMultiplier: 1.17, // Retail Trade
    description: "Local markets and grocers retain 52-56% locally, often sourcing from local farms and producers."
  },
  {
    key: "events",
    name: "Events (Show / Market / Ticket)",
    retentionLow: 0.45,
    retentionLikely: 0.55,
    retentionHigh: 0.65,
    chainRetention: 0.25,
    ioMultiplier: 1.06, // Recreation & Entertainment
    description: "Local events support local venues, artists, and vendors with 45-65% retention depending on the event type."
  }
];

export function getCategoryByKey(key: string): Category | undefined {
  return categories.find(cat => cat.key === key);
}

export function getDefaultCategory(): Category {
  return categories[0];
}
