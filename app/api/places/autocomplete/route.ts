import { NextRequest, NextResponse } from "next/server";
import type { PlaceSuggestion } from "@/lib/types/places";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Reno, NV coordinates
const RENO_LAT = 39.5296;
const RENO_LNG = -119.8138;
const SEARCH_RADIUS = 25000; // 25km in meters

export async function POST(request: NextRequest) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { query, sessionToken } = await request.json();

    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          input: query,
          locationBias: {
            circle: {
              center: {
                latitude: RENO_LAT,
                longitude: RENO_LNG,
              },
              radius: SEARCH_RADIUS,
            },
          },
          ...(sessionToken && { sessionToken }),
        }),
      }
    );

    if (!response.ok) {
      // Log minimally for debugging, return empty results
      console.error("Google Places API error:", response.status);
      return NextResponse.json({ suggestions: [] });
    }

    const data = await response.json();

    // Transform Google's response to our format - limit to 3 results to save API calls
    const suggestions: PlaceSuggestion[] = (data.suggestions || [])
      .slice(0, 3)
      .map(
        (suggestion: {
          placePrediction?: {
            placeId: string;
            structuredFormat?: {
              mainText?: { text: string };
              secondaryText?: { text: string };
            };
          };
        }) => ({
          placeId: suggestion.placePrediction?.placeId || "",
          mainText: suggestion.placePrediction?.structuredFormat?.mainText?.text || "",
          secondaryText: suggestion.placePrediction?.structuredFormat?.secondaryText?.text || "",
        })
      )
      .filter((s: PlaceSuggestion) => s.placeId && s.mainText);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

