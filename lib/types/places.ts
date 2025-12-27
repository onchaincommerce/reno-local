export interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface SelectedPlace {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  location: { lat: number; lng: number };
  websiteUri?: string;
  googleMapsUri?: string;
  types: string[];
}

