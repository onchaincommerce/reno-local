"use client";

import type { Frequency } from "@/lib/utils/calculations";

interface FrequencyToggleProps {
  value: Frequency;
  onChange: (frequency: Frequency) => void;
}

const frequencies: { key: Frequency; label: string }[] = [
  { key: "once", label: "One-time" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export function FrequencyToggle({ value, onChange }: FrequencyToggleProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-3 text-white">
        How often?
      </label>
      <div className="flex gap-2">
        {frequencies.map((freq) => {
          const isSelected = value === freq.key;
          return (
            <button
              key={freq.key}
              type="button"
              onClick={() => onChange(freq.key)}
              className={`
                flex-1 px-4 py-3 rounded-organic text-sm font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-gradient-to-r from-strawberry to-strawberry-dark text-white shadow-lg"
                    : "bg-white/90 text-charcoal border border-white/30 hover:bg-white hover:shadow-sm"
                }
              `}
              aria-pressed={isSelected}
            >
              {freq.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
