"use client";

import { useState, useEffect } from "react";
import { getFullShareUrl } from "@/lib/utils/url-params";
import { formatCurrency, type Frequency, type CalculatedResults } from "@/lib/utils/calculations";
import type { Category } from "@/lib/data/categories";

interface ShareButtonProps {
  category: Category;
  amount: number;
  frequency: Frequency;
  results: CalculatedResults;
  placeName?: string;
  googleMapsUri?: string;
}

export function ShareButton({ 
  category, 
  amount, 
  frequency, 
  results,
  placeName,
  googleMapsUri,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const buildShareText = (): string => {
    const lines: string[] = [];
    
    // Opening line with place name if available (first person)
    if (placeName) {
      lines.push(`I just spent ${formatCurrency(amount)} at ${placeName}!`);
    } else {
      lines.push(`I just spent ${formatCurrency(amount)} at a local ${category.name.toLowerCase()}!`);
    }
    
    // The key stat - how much more stays local
    lines.push(`${formatCurrency(results.localPremium)} MORE stays in Reno vs a chain.`);
    
    // Breakdown
    lines.push(`(${formatCurrency(results.retained.likely)} local vs ${formatCurrency(results.chainRetained)} chain)`);
    
    // Projections if recurring
    if (frequency === "weekly" && results.monthly) {
      lines.push(`That's ${formatCurrency(results.monthly.localPremium)} extra for Reno every month!`);
    } else if (frequency === "monthly" && results.yearly) {
      lines.push(`That's ${formatCurrency(results.yearly.localPremium)} extra for Reno every year!`);
    }
    
    // Add Google Maps link if available
    if (googleMapsUri) {
      lines.push(`📍 ${googleMapsUri}`);
    }
    
    // Call to action with URL
    lines.push(`Calculate yours: renolocal.xyz`);
    
    return lines.join("\n\n");
  };

  const handleShare = async () => {
    const url = getFullShareUrl(category.key, amount, frequency);
    const shareText = buildShareText();
    
    if (canShare) {
      try {
        await navigator.share({
          title: "Reno Local Dollars",
          text: shareText,
          url: url,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className="w-full px-6 py-4 rounded-organic text-lg font-semibold text-white bg-gradient-to-r from-strawberry to-strawberry-dark shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        aria-label="Share result"
      >
        <span className="flex items-center justify-center gap-2">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
            />
          </svg>
          {copied ? "Link copied!" : "Share your impact"}
        </span>
      </button>
      {copied && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-charcoal text-white px-4 py-2 rounded-organic text-sm whitespace-nowrap shadow-lg animate-fade-in z-10"
          role="status"
          aria-live="polite"
        >
          Link copied!
        </div>
      )}
    </div>
  );
}
