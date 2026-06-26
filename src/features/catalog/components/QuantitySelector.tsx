import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

interface QuantitySelectorProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, max, min = 1, onChange }: QuantitySelectorProps) {
  const { t } = useTranslation("storefront");
  const [inputValue, setInputValue] = useState(String(value));

  const commitValue = (rawValue: string) => {
    const parsed = Number.parseInt(rawValue, 10);
    const nextValue = Number.isNaN(parsed) ? min : Math.min(Math.max(parsed, min), max);
    setInputValue(String(nextValue));
    onChange(nextValue);
  };

  const updateValue = (nextValue: number) => {
    const safeValue = Math.min(Math.max(nextValue, min), max);
    setInputValue(String(safeValue));
    onChange(safeValue);
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label={t("common.decreaseQuantity")}
        disabled={value <= min}
        onClick={() => updateValue(value - 1)}
        className="hover:bg-ocop-light flex h-10 w-10 items-center justify-center rounded-l-lg border border-gray-200 bg-white text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-green-950/30"
      >
        <Icon icon="mdi:minus" width={18} />
      </button>
      <Input
        inputMode="numeric"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onBlur={(event) => commitValue(event.target.value)}
        className="h-10 w-14 rounded-none border-x-0 text-center"
      />
      <button
        type="button"
        aria-label={t("common.increaseQuantity")}
        disabled={value >= max}
        onClick={() => updateValue(value + 1)}
        className="hover:bg-ocop-light flex h-10 w-10 items-center justify-center rounded-r-lg border border-gray-200 bg-white text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-green-950/30"
      >
        <Icon icon="mdi:plus" width={18} />
      </button>
    </div>
  );
}
