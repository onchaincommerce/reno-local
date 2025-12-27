"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calculator } from "@/components/Calculator";
import { parseUrlParams } from "@/lib/utils/url-params";
import type { Frequency } from "@/lib/utils/calculations";

export default function SharedResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [params, setParams] = useState<{
    category?: string;
    amount?: number;
    frequency?: Frequency;
  }>({});

  useEffect(() => {
    const parsed = parseUrlParams(searchParams);
    setParams(parsed);
  }, [searchParams]);

  const handleEdit = () => {
    router.push("/");
  };

  return (
    <>
      <div className="reno-background" aria-hidden="true" />
      <div className="min-h-screen py-8 px-4 sm:py-12 sm:px-6">
        <Calculator
          initialCategory={params.category}
          initialAmount={params.amount}
          initialFrequency={params.frequency}
          isSharedView={true}
          onEdit={handleEdit}
        />
      </div>
    </>
  );
}

