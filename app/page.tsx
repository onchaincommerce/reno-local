"use client";

import { useState, useEffect } from "react";
import { Calculator } from "@/components/Calculator";
import { PlaceSearch } from "@/components/PlaceSearch";
import { BusinessResearchCard } from "@/components/BusinessResearchCard";
import type { SelectedPlace } from "@/lib/types/places";
import type { BusinessResearch } from "@/lib/types/research";

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [research, setResearch] = useState<BusinessResearch | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  // Fetch research when a place is selected
  useEffect(() => {
    if (!selectedPlace) {
      setResearch(null);
      return;
    }

    const fetchResearch = async () => {
      setIsResearching(true);
      try {
        const response = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ place: selectedPlace }),
        });

        if (response.ok) {
          const data = await response.json();
          setResearch(data.research);
        } else {
          console.error("Failed to fetch research");
        }
      } catch (error) {
        console.error("Research error:", error);
      } finally {
        setIsResearching(false);
      }
    };

    fetchResearch();
  }, [selectedPlace]);

  const handlePlaceSelected = (place: SelectedPlace) => {
    setSelectedPlace(place);
  };

  const handleSearchDifferent = () => {
    setSelectedPlace(null);
    setResearch(null);
  };

  return (
    <>
      <div className="reno-background" aria-hidden="true" />
      <div className="min-h-screen py-8 px-4 sm:py-12 sm:px-6">
        {selectedPlace ? (
          <div className="w-full max-w-2xl mx-auto space-y-4">
            {/* Selected Place Info */}
            <div className="glass-card rounded-organic p-4 card-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 mb-1">
                    Calculating impact for
                  </p>
                  <h2 className="text-xl font-bold text-white truncate">
                    {selectedPlace.displayName}
                  </h2>
                  <p className="text-sm text-white/70 truncate">
                    {selectedPlace.formattedAddress}
                  </p>
                  {selectedPlace.googleMapsUri && (
                    <a
                      href={selectedPlace.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-strawberry-light hover:text-white mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Google Maps
                    </a>
                  )}
                </div>
                <button
                  onClick={handleSearchDifferent}
                  className="shrink-0 px-3 py-2 text-sm font-medium text-kiwi-dark bg-white/90 rounded-organic border border-white/30 hover:bg-white transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Research Section */}
              <div className="mt-4 pt-4 border-t border-white/20">
                {isResearching ? (
                  <BusinessResearchCard research={{} as BusinessResearch} isLoading={true} />
                ) : research ? (
                  <BusinessResearchCard research={research} />
                ) : null}
              </div>
            </div>

            {/* Calculator */}
            <Calculator 
              selectedPlace={selectedPlace} 
              suggestedCategory={research?.suggestedCategory || undefined}
              localConfidenceScore={research?.localConfidenceScore}
              isChain={research?.isChain}
              isResearchComplete={!isResearching && research !== null}
            />
          </div>
        ) : (
          <PlaceSearch onPlaceSelected={handlePlaceSelected} />
        )}
      </div>
    </>
  );
}
