import { Suspense } from "react";
import { Metadata } from "next";
import SharedResultClient from "./shared-result-client";

interface PageProps {
  searchParams: Promise<{ c?: string; a?: string; f?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.c || "coffee";
  const amount = params.a || "10";
  
  return {
    title: "Reno Local Dollars | Your Results",
    description: "See how much of your purchase stays in Washoe County when you shop local.",
    openGraph: {
      title: "Reno Local Dollars Calculator",
      description: "See how much stays in Washoe County when you shop local",
      images: [
        {
          url: `/api/og?c=${category}&a=${amount}`,
          width: 1200,
          height: 630,
          alt: "Your Reno Local Dollars result",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Reno Local Dollars Calculator",
      description: "See how much stays in Washoe County when you shop local",
      images: [`/api/og?c=${category}&a=${amount}`],
    },
  };
}

function SharedResultContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4 sm:py-12 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="glass-card rounded-organic p-6 card-shadow animate-pulse">
            <div className="h-8 bg-foreground/10 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    }>
      <SharedResultClient />
    </Suspense>
  );
}

export default function SharedResultPage() {
  return <SharedResultContent />;
}
