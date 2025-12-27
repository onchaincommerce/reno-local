export interface BusinessResearch {
  localConfidenceScore: number; // 0-100
  confidenceReasoning: string;
  ownershipInfo: string;
  businessBackground: string;
  localConnections: string[];
  suggestedCategory: string | null;
  categoryReasoning: string;
  isChain: boolean;
  chainInfo?: string;
}

