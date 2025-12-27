"use client";

import { useState, useEffect } from "react";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ value, onChange }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    setDisplayValue(value === 0 ? "" : value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow empty input
    if (input === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Allow only numbers and one decimal point
    const validInput = input.replace(/[^0-9.]/g, "");
    if (validInput !== input) {
      return;
    }

    // Prevent multiple decimal points
    const parts = validInput.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setDisplayValue(validInput);
    const numValue = parseFloat(validInput);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // Format on blur
    if (displayValue && !isNaN(parseFloat(displayValue))) {
      const numValue = parseFloat(displayValue);
      setDisplayValue(numValue.toFixed(2));
      onChange(numValue);
    } else {
      setDisplayValue("");
      onChange(0);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="amount" className="block text-sm font-semibold mb-3 text-white">
        How much?
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-kiwi-dark font-semibold text-lg">
          $
        </span>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0.00"
          className="w-full pl-9 pr-4 py-4 rounded-organic border-2 border-kiwi/30 bg-white text-charcoal text-xl font-medium placeholder:text-granite/50 focus:outline-none focus:border-strawberry focus:ring-2 focus:ring-strawberry/30 transition-all"
          aria-label="Purchase amount in dollars"
        />
      </div>
    </div>
  );
}
