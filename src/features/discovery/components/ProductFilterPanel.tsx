import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import type { Category, ProductDiscoveryFilters } from "@/features/catalog/types/catalog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

interface ProductFilterPanelProps {
  filters: ProductDiscoveryFilters;
  categories: Category[];
  regions: string[];
  priceBounds: { min: number; max: number };
  totalCount?: number;
  categoryCounts?: Record<string, number>;
  ratingCounts?: Record<number, number>;
  onChange: (updates: Partial<ProductDiscoveryFilters>) => void;
  onReset: () => void;
  onApply?: () => void;
  hideCategoryFilter?: boolean;
}

const ALL_VALUE = "all";
const OCOP_STARS = [3, 4, 5] as const;
const RATINGS = [5, 4, 3, 2, 1] as const;

export function ProductFilterPanel({
  filters,
  categories,
  regions,
  priceBounds,
  totalCount = 0,
  categoryCounts = {},
  ratingCounts = {},
  onChange,
  onReset,
  onApply,
  hideCategoryFilter,
}: ProductFilterPanelProps) {
  const { t } = useTranslation("storefront");
  const hasPriceRange = priceBounds.max > priceBounds.min;
  const rangeMin = hasPriceRange ? priceBounds.min : 0;
  const rangeMax = hasPriceRange ? priceBounds.max : 0;
  const selectedMin = Math.min(Math.max(filters.minPrice ?? rangeMin, rangeMin), rangeMax);
  const selectedMax = Math.max(Math.min(filters.maxPrice ?? rangeMax, rangeMax), selectedMin);
  const priceStep = 10000;

  const updateMinPrice = (value: number) => {
    const nextValue = Math.min(Math.max(value, rangeMin), selectedMax);
    onChange({ minPrice: nextValue <= rangeMin ? null : nextValue });
  };

  const updateMaxPrice = (value: number) => {
    const nextValue = Math.max(Math.min(value, rangeMax), selectedMin);
    onChange({ maxPrice: nextValue >= rangeMax ? null : nextValue });
  };

  return (
    <aside className="space-y-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("filter.region")}</label>
        <Select
          value={filters.region || ALL_VALUE}
          onValueChange={(value) => onChange({ region: value === ALL_VALUE ? "" : value })}
        >
          <SelectTrigger className="h-11 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <SelectValue placeholder={t("filter.regionPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t("filter.regionPlaceholder")}</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("filter.ocopStar")}</p>
        <div className="grid grid-cols-3 gap-2">
          {OCOP_STARS.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                onChange({
                  ocopStar: filters.ocopStar === star ? null : star,
                })
              }
              className={cn(
                "rounded-lg border px-2 py-2 text-sm font-semibold transition-colors",
                filters.ocopStar === star
                  ? "border-ocop bg-ocop-light text-ocop dark:bg-green-950/30"
                  : "hover:border-ocop/60 hover:text-ocop border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300",
              )}
            >
              {star}
              <Icon icon="mdi:star" className="ml-1 inline" width={14} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("filter.priceRange")}</p>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min={0}
            value={filters.minPrice ?? ""}
            placeholder={t("filter.minPriceShort")}
            onChange={(event) => {
              const nextValue = event.target.value ? Number(event.target.value) : null;
              onChange({
                minPrice: nextValue === null ? null : Math.min(Math.max(nextValue, rangeMin), selectedMax),
              });
            }}
            className="h-11 bg-white dark:border-gray-700 dark:bg-gray-800"
          />
          <Input
            type="number"
            min={0}
            value={filters.maxPrice ?? ""}
            placeholder={t("filter.maxPriceShort")}
            onChange={(event) => {
              const nextValue = event.target.value ? Number(event.target.value) : null;
              onChange({
                maxPrice: nextValue === null ? null : Math.max(Math.min(nextValue, rangeMax), selectedMin),
              });
            }}
            className="h-11 bg-white dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {hasPriceRange && (
          <div className="space-y-2">
            <div className="space-y-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {t("filter.minPriceShort")}
                </span>
                <input
                  type="range"
                  aria-label={t("filter.minPrice")}
                  min={rangeMin}
                  max={selectedMax}
                  step={priceStep}
                  value={selectedMin}
                  onChange={(event) => updateMinPrice(Number(event.target.value))}
                  className="price-range-input h-5 w-full"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {t("filter.maxPriceShort")}
                </span>
                <input
                  type="range"
                  aria-label={t("filter.maxPrice")}
                  min={selectedMin}
                  max={rangeMax}
                  step={priceStep}
                  value={selectedMax}
                  onChange={(event) => updateMaxPrice(Number(event.target.value))}
                  className="price-range-input h-5 w-full"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(selectedMin)} - {formatCurrency(selectedMax)}
            </p>
          </div>
        )}
      </div>

      {!hideCategoryFilter && (
        <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t("filter.category")}</label>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Checkbox
                checked={!filters.category}
                onCheckedChange={() => onChange({ category: "" })}
                className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop"
              />
              <span className="min-w-0 flex-1 truncate">{t("filter.allProducts")}</span>
              <span className="text-gray-400">({totalCount})</span>
            </label>
            {categories.slice(1, 7).map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <Checkbox
                  checked={filters.category === category.slug}
                  onCheckedChange={() =>
                    onChange({
                      category: filters.category === category.slug ? "" : category.slug,
                    })
                  }
                  className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop"
                />
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <span className="text-gray-400">({categoryCounts[category.slug] ?? 0})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <p className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t("filter.rating")}
          <Icon icon="mdi:chevron-up" className="text-ocop" width={16} />
        </p>
        <div className="space-y-2">
          {RATINGS.map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Checkbox
                checked={filters.rating === rating}
                onCheckedChange={() =>
                  onChange({
                    rating: filters.rating === rating ? null : rating,
                  })
                }
                className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop"
              />
              <span className="flex min-w-0 flex-1 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon
                    key={index}
                    icon={index < rating ? "mdi:star" : "mdi:star-outline"}
                    className="text-ocop-amber"
                    width={15}
                  />
                ))}
              </span>
              <span className="text-gray-400">({ratingCounts[rating] ?? 0})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="hover:border-ocop hover:text-ocop h-12 rounded-lg border-gray-200 font-bold text-gray-600 dark:border-gray-700 dark:text-gray-300"
          onClick={onReset}
        >
          {t("filter.reset")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-ocop text-ocop hover:bg-ocop h-12 rounded-lg font-bold hover:text-white"
          onClick={onApply}
        >
          {t("filter.apply")}
        </Button>
      </div>
    </aside>
  );
}
