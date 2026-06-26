import { useTranslation } from "react-i18next";
import type { ProductSortKey } from "@/features/catalog/types/catalog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductSortSelectProps {
  value: ProductSortKey;
  onChange: (value: ProductSortKey) => void;
}

const SORT_OPTIONS: ProductSortKey[] = ["popular", "priceAsc", "priceDesc", "ratingDesc", "newest"];

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
  const { t } = useTranslation("storefront");

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm font-medium text-gray-600 sm:inline dark:text-gray-300">{t("sort.label")}:</span>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as ProductSortKey)}>
        <SelectTrigger className="h-10 w-40 rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`sort.${option}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
