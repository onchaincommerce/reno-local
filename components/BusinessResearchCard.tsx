"use client";

import type { BusinessResearch } from "@/lib/types/research";

interface BusinessResearchCardProps {
  research: BusinessResearch;
  isLoading?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-kiwi-dark";
  if (score >= 60) return "text-kiwi";
  if (score >= 40) return "text-strawberry";
  return "text-strawberry-dark";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Definitely Local";
  if (score >= 70) return "Likely Local";
  if (score >= 50) return "Mixed";
  if (score >= 30) return "Likely Chain";
  return "National Chain";
}

export function BusinessResearchCard({ research, isLoading }: BusinessResearchCardProps) {
  if (isLoading) {
    return (
      <div className="inner-card p-4 border border-kiwi/30 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-strawberry/30 border-t-strawberry rounded-full animate-spin" />
          <p className="text-granite">Researching business...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Confidence Score */}
      <div className="inner-card p-4 border-2 border-kiwi/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-granite">Local Confidence</p>
          {research.isChain && (
            <span className="text-xs px-2 py-1 rounded-full bg-strawberry/15 text-strawberry-dark font-medium">
              Chain
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <span className={`text-3xl font-bold ${getScoreColor(research.localConfidenceScore)}`}>
            {research.localConfidenceScore}
          </span>
          <span className="text-sm text-granite">/ 100</span>
          <span className={`text-sm font-medium ${getScoreColor(research.localConfidenceScore)}`}>
            {getScoreLabel(research.localConfidenceScore)}
          </span>
        </div>
        <p className="text-sm mt-2 text-granite">
          {research.confidenceReasoning}
        </p>
      </div>

      {/* Ownership & Background */}
      <div className="inner-card p-4 border border-kiwi/20">
        <p className="text-sm font-medium mb-2 text-charcoal">About this Business</p>
        
        {research.ownershipInfo && (
          <div className="mb-3">
            <p className="text-xs font-medium text-granite">Ownership</p>
            <p className="text-sm text-charcoal">{research.ownershipInfo}</p>
          </div>
        )}
        
        {research.businessBackground && (
          <div className="mb-3">
            <p className="text-xs font-medium text-granite">Background</p>
            <p className="text-sm text-charcoal">{research.businessBackground}</p>
          </div>
        )}

        {research.chainInfo && (
          <div className="mb-3 p-2 rounded-lg bg-strawberry/10 border border-strawberry/30">
            <p className="text-xs font-medium text-strawberry-dark">Chain Info</p>
            <p className="text-sm text-strawberry-dark">{research.chainInfo}</p>
          </div>
        )}
      </div>

      {/* Local Connections */}
      {research.localConnections && research.localConnections.length > 0 && (
        <div className="inner-card p-4 border border-kiwi/20">
          <p className="text-sm font-medium mb-2 text-charcoal">Local Connections</p>
          <ul className="space-y-1">
            {research.localConnections.map((connection, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-granite">
                <span className="text-kiwi mt-1">•</span>
                {connection}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

