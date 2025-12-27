import { categories } from "@/lib/data/categories";

/**
 * Maps Google Places types to our category keys.
 * Returns the best matching category key or null if no match.
 */
export function mapPlaceTypesToCategory(types: string[]): string | null {
  if (!types || types.length === 0) return null;

  // Priority mapping - check in order
  const typeMap: Record<string, string> = {
    // Coffee / Cafe
    cafe: "coffee",
    coffee_shop: "coffee",
    
    // Quick Meal
    fast_food_restaurant: "quick-meal",
    sandwich_shop: "quick-meal",
    hamburger_restaurant: "quick-meal",
    pizza_restaurant: "quick-meal",
    mexican_restaurant: "quick-meal",
    
    // Restaurant Dinner
    restaurant: "restaurant-dinner",
    fine_dining_restaurant: "restaurant-dinner",
    american_restaurant: "restaurant-dinner",
    italian_restaurant: "restaurant-dinner",
    chinese_restaurant: "restaurant-dinner",
    japanese_restaurant: "restaurant-dinner",
    thai_restaurant: "restaurant-dinner",
    indian_restaurant: "restaurant-dinner",
    vietnamese_restaurant: "restaurant-dinner",
    korean_restaurant: "restaurant-dinner",
    seafood_restaurant: "restaurant-dinner",
    steak_house: "restaurant-dinner",
    sushi_restaurant: "restaurant-dinner",
    
    // Bar / Brewery
    bar: "bar-brewery",
    brewery: "bar-brewery",
    wine_bar: "bar-brewery",
    pub: "bar-brewery",
    night_club: "bar-brewery",
    
    // Local Retail / Thrift
    store: "local-retail",
    clothing_store: "local-retail",
    book_store: "local-retail",
    gift_shop: "local-retail",
    home_goods_store: "local-retail",
    furniture_store: "local-retail",
    jewelry_store: "local-retail",
    shoe_store: "local-retail",
    sporting_goods_store: "local-retail",
    pet_store: "local-retail",
    florist: "local-retail",
    hardware_store: "local-retail",
    electronics_store: "local-retail",
    bicycle_store: "local-retail",
    secondhand_store: "local-retail",
    
    // Personal Services
    hair_salon: "personal-services",
    hair_care: "personal-services",
    beauty_salon: "personal-services",
    nail_salon: "personal-services",
    barber_shop: "personal-services",
    spa: "personal-services",
    tattoo_shop: "personal-services",
    
    // Local Groceries / Market
    grocery_store: "local-groceries",
    supermarket: "local-groceries",
    farmer_market: "local-groceries",
    bakery: "local-groceries",
    butcher_shop: "local-groceries",
    liquor_store: "local-groceries",
    convenience_store: "local-groceries",
    
    // Events
    event_venue: "events",
    movie_theater: "events",
    performing_arts_theater: "events",
    concert_hall: "events",
    museum: "events",
    art_gallery: "events",
    amusement_park: "events",
    bowling_alley: "events",
  };

  // Check each type in order and return first match
  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type];
    }
  }

  // Fallback: check for partial matches
  const typesStr = types.join(" ").toLowerCase();
  
  if (typesStr.includes("coffee") || typesStr.includes("cafe")) return "coffee";
  if (typesStr.includes("restaurant") || typesStr.includes("food")) return "restaurant-dinner";
  if (typesStr.includes("bar") || typesStr.includes("brew")) return "bar-brewery";
  if (typesStr.includes("store") || typesStr.includes("shop")) return "local-retail";
  if (typesStr.includes("salon") || typesStr.includes("hair") || typesStr.includes("beauty")) return "personal-services";
  if (typesStr.includes("market") || typesStr.includes("grocery") || typesStr.includes("bakery")) return "local-groceries";

  return null;
}

/**
 * Get the category object from a place's types
 */
export function getCategoryFromPlaceTypes(types: string[]) {
  const categoryKey = mapPlaceTypesToCategory(types);
  if (!categoryKey) return null;
  return categories.find(c => c.key === categoryKey) || null;
}

