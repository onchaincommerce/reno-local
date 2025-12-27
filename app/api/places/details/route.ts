import { NextRequest, NextResponse } from "next/server";
import type { SelectedPlace } from "@/lib/types/places";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Fields we want from the Place Details API
const FIELD_MASK = [
  "displayName",
  "formattedAddress",
  "location",
  "websiteUri",
  "googleMapsUri",
  "types",
].join(",");

export async function POST(request: NextRequest) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { placeId, sessionToken } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { error: "placeId is required" },
        { status: 400 }
      );
    }

    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    };

    // Include session token if provided (for billing grouping)
    if (sessionToken) {
      headers["X-Goog-SessionToken"] = sessionToken;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Place Details API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch place details" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform to our SelectedPlace format
    const place: SelectedPlace = {
      placeId,
      displayName: data.displayName?.text || "",
      formattedAddress: data.formattedAddress || "",
      location: {
        lat: data.location?.latitude || 0,
        lng: data.location?.longitude || 0,
      },
      websiteUri: data.websiteUri,
      googleMapsUri: data.googleMapsUri,
      types: data.types || [],
    };

    return NextResponse.json({ place });
  } catch (error) {
    console.error("Place details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

