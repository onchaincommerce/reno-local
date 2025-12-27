"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PlaceSuggestion, SelectedPlace } from "@/lib/types/places";

interface PlaceSearchProps {
  onPlaceSelected: (place: SelectedPlace) => void;
}

function generateSessionToken(): string {
  return crypto.randomUUID();
}

export function PlaceSearch({ onPlaceSelected }: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session token on first keystroke
  const ensureSessionToken = useCallback(() => {
    if (!sessionToken) {
      const token = generateSessionToken();
      setSessionToken(token);
      return token;
    }
    return sessionToken;
  }, [sessionToken]);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(
    async (searchQuery: string, token: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (searchQuery.length < 3) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const response = await fetch("/api/places/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery, sessionToken: token }),
          signal: controller.signal,
        });

        if (!response.ok) {
          // Silently fail on API errors - user can keep typing
          setSuggestions([]);
          return;
        }

        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setIsOpen(data.suggestions?.length > 0);
        setHighlightedIndex(-1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Autocomplete error:", error);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounced search - 500ms to reduce API calls
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const token = ensureSessionToken();
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query, token);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, ensureSessionToken, fetchSuggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle selection
  const handleSelect = async (suggestion: PlaceSuggestion) => {
    setIsLoading(true);
    setIsOpen(false);
    setQuery(suggestion.mainText);

    try {
      const response = await fetch("/api/places/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: suggestion.placeId,
          sessionToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch place details");
      }

      const data = await response.json();

      // Reset session token for next search
      setSessionToken(null);

      onPlaceSelected(data.place);
    } catch (error) {
      console.error("Place details error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center space-y-4 mb-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/rld_logo.png" alt="Reno Local Dollars" className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl" />
        </div>
        {/* Title - clean kiwi green */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wide drop-shadow-lg"
          style={{ 
            fontFamily: 'var(--font-oswald), sans-serif',
            color: 'white'
          }}
        >
          Reno Local Dollars
        </h1>
        <p className="text-lg font-semibold text-white/90 drop-shadow">
          Search for a local Reno business to see your impact
        </p>
      </div>

      <div className="glass-card rounded-organic p-6 sm:p-8 card-shadow">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Find a local business
        </label>

        <div className="relative">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kiwi-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              placeholder="Search coffee shops, restaurants, stores..."
              className="w-full pl-12 pr-10 py-4 rounded-organic border-2 border-kiwi/30 bg-white text-charcoal placeholder:text-granite/60 focus:outline-none focus:border-strawberry focus:ring-2 focus:ring-strawberry/30 transition-all text-lg"
              aria-label="Search for a business"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              role="combobox"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-strawberry/30 border-t-strawberry rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-2 bg-white rounded-organic border-2 border-kiwi/30 shadow-xl overflow-hidden"
              role="listbox"
            >
              <ul className="max-h-80 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.placeId}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === highlightedIndex
                        ? "bg-kiwi/10"
                        : "hover:bg-strawberry/10"
                    }`}
                    onClick={() => handleSelect(suggestion)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <p className="font-medium text-charcoal">
                      {suggestion.mainText}
                    </p>
                    <p className="text-sm text-granite">
                      {suggestion.secondaryText}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Google Attribution */}
              <div className="px-4 py-2 border-t border-kiwi/20 bg-gray-50">
                <p className="text-xs text-granite flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Powered by Google
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Helper text */}
        <p className="mt-3 text-sm text-white/60">
          Type at least 3 characters to search
        </p>
      </div>
    </div>
  );
}
