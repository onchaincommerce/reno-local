import { NextRequest, NextResponse } from "next/server";
import type { BusinessResearch } from "@/lib/types/research";
import type { SelectedPlace } from "@/lib/types/places";
import { categories } from "@/lib/data/categories";

const XAI_API_KEY = process.env.X_API_KEY;
const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

export async function POST(request: NextRequest) {
  if (!XAI_API_KEY) {
    return NextResponse.json(
      { error: "xAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { place }: { place: SelectedPlace } = await request.json();

    if (!place) {
      return NextResponse.json(
        { error: "Place data is required" },
        { status: 400 }
      );
    }

    // Build the prompt for Grok
    const categoryList = categories.map(c => `- ${c.key}: ${c.name}`).join("\n");
    
    const prompt = `You are a local business researcher for Reno/Washoe County, Nevada. Analyze the following business and provide a detailed assessment of how "local" it truly is.

Business Information:
- Name: ${place.displayName}
- Address: ${place.formattedAddress}
- Google Place Types: ${place.types?.join(", ") || "Unknown"}
${place.websiteUri ? `- Website: ${place.websiteUri}` : ""}

Research this business and provide:

1. **Local Confidence Score (0-100)**: How confident are you that this is a truly local, independent business? 
   - 90-100: Definitely local/independent, locally owned and operated
   - 70-89: Likely local, may have some chain-like aspects but primarily independent
   - 50-69: Mixed - could be a franchise with local owner or regional chain
   - 30-49: Likely a regional/national chain or franchise
   - 0-29: Definitely a national/international chain

2. **Ownership Information**: What do you know about who owns this business? Is it locally owned? Part of a larger corporation?

3. **Business Background**: Brief history or background of this business in Reno.

4. **Local Connections**: List any known local connections (sources local ingredients, employs locals, supports local causes, etc.)

5. **Category Suggestion**: Which of these categories best fits this business?
${categoryList}

6. **Is this a chain?**: Is this business part of a regional or national chain?

Respond in this exact JSON format:
{
  "localConfidenceScore": <number 0-100>,
  "confidenceReasoning": "<explanation of the score>",
  "ownershipInfo": "<ownership details>",
  "businessBackground": "<brief background>",
  "localConnections": ["<connection 1>", "<connection 2>"],
  "suggestedCategory": "<category key or null>",
  "categoryReasoning": "<why this category>",
  "isChain": <true/false>,
  "chainInfo": "<if chain, details about the chain>"
}

Be concise but informative. If you don't have specific information, make reasonable inferences based on the business name, type, and location, but note your uncertainty.`;

    const response = await fetch(XAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that researches local businesses in Reno, Nevada. You always respond with valid JSON only, no markdown or extra text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("xAI API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to research business" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let research: BusinessResearch;
    try {
      // Clean up potential markdown code blocks
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      research = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ research });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

