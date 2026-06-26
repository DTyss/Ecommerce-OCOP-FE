import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import type { Category, ProductDiscoveryFilters } from "@/features/catalog/types/catalog";
import { getCategoryNameBySlug } from "../utils/productDiscovery";
import { formatCurrency } from "@/utils/currency";

interface ActiveFilterChipsProps {
  filters: ProductDiscoveryFilters;
  categories: Category[];
  onRemove: (updates: Partial<ProductDiscoveryFilters>) => void;
}

interface Chip {
  key: string;
  label: string;
  updates: Partial<ProductDiscoveryFilters>;
}

export function ActiveFilterChips({ filters, categories, onRemove }: ActiveFilterChipsProps) {
  const { t } = useTranslation("storefront");
  const chips: Chip[] = [];

  if (filters.keyword) {
    chips.push({
      key: "keyword",
      label: `${t("filter.keyword")}: ${filters.keyword}`,
      updates: { keyword: "" },
    });
  }

  if (filters.category) {
    chips.push({
      key: "category",
      label: getCategoryNameBySlug(filters.category, categories) ?? filters.category,
      updates: { category: "" },
    });
  }

  if (filters.region) {
    chips.push({
      key: "region",
      label: filters.region,
      updates: { region: "" },
    });
  }

  if (filters.ocopStar) {
    chips.push({
      key: "ocopStar",
      label: t("product.ocopStar", { star: filters.ocopStar }),
      updates: { ocopStar: null },
    });
  }

  if (filters.minPrice !== null) {
    chips.push({
      key: "minPrice",
      label: `${t("filter.minPrice")}: ${formatCurrency(filters.minPrice)}`,
      updates: { minPrice: null },
    });
  }

  if (filters.maxPrice !== null) {
    chips.push({
      key: "maxPrice",
      label: `${t("filter.maxPrice")}: ${formatCurrency(filters.maxPrice)}`,
      updates: { maxPrice: null },
    });
  }

  if (filters.rating !== null) {
    chips.push({
      key: "rating",
      label: t("filter.ratingFrom", { count: filters.rating }),
      updates: { rating: null },
    });
  }

  if (!chips.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.updates)}
          className="border-ocop/20 bg-ocop-light text-ocop hover:border-ocop hover:bg-ocop inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:text-white dark:bg-green-950/30"
        >
          {chip.label}
          <Icon icon="mdi:close" width={14} />
        </button>
      ))}
    </div>
  );
}
