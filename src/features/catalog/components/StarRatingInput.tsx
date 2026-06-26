import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 28 }: StarRatingInputProps) {
  const { t } = useTranslation("storefront");
  const [hovered, setHovered] = useState(0);
  const displayRating = hovered || value;

  return (
    <div role="group" aria-label={t("review.yourRating")} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={t("review.starLabel", { count: star })}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:ring-ocop/30 rounded-full p-0.5 transition-transform hover:scale-110 focus:ring-2 focus:outline-none"
        >
          <Icon
            icon={star <= displayRating ? "mdi:star" : "mdi:star-outline"}
            className={cn(star <= displayRating ? "text-ocop-amber" : "text-gray-300")}
            width={size}
          />
        </button>
      ))}
    </div>
  );
}
