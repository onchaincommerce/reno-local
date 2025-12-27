import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCategoryByKey, getDefaultCategory } from "@/lib/data/categories";
import { formatCurrency } from "@/lib/utils/calculations";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const categoryKey = searchParams.get("c") || "coffee";
  const amountStr = searchParams.get("a") || "10";
  
  const category = getCategoryByKey(categoryKey) || getDefaultCategory();
  const amount = parseFloat(amountStr) || 10;
  const retainedAmount = amount * category.retentionLikely;
  const chainAmount = amount * category.chainRetention;
  const premium = retainedAmount - chainAmount;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Background with gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(135deg, #FF6B35 0%, #FF4D8D 50%, #6B5B95 100%)",
          }}
        />
        
        {/* Content card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "32px",
            padding: "48px 64px",
            margin: "40px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#2C241E",
              marginBottom: "16px",
            }}
          >
            Reno Local Dollars
          </div>

          {/* Category */}
          <div
            style={{
              fontSize: "20px",
              color: "#666",
              marginBottom: "32px",
            }}
          >
            {category.name}
          </div>

          {/* Main amount */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #FF6B35, #FF4D8D)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "8px",
            }}
          >
            {formatCurrency(retainedAmount)}
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#666",
              marginBottom: "24px",
            }}
          >
            stays in Washoe County
          </div>

          {/* Comparison */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, rgba(0, 212, 170, 0.1), rgba(74, 144, 217, 0.1))",
              padding: "12px 24px",
              borderRadius: "16px",
              border: "1px solid rgba(0, 212, 170, 0.3)",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#00D4AA" }}>
              +{formatCurrency(premium)}
            </span>
            <span style={{ fontSize: "18px", color: "#666" }}>
              more than a national chain
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

