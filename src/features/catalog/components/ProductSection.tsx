import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { ProductCard } from "./ProductCard";
import type { Product, ProductSortKey } from "@/features/catalog/types/catalog";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSectionProps {
  title: string;
  icon: string;
  iconClass?: string;
  products?: Product[];
  maxItems?: number;
  isLoading?: boolean;
  showControls?: boolean;
  gridClassName?: string;
  viewAllSearch?: {
    sort?: ProductSortKey;
    category?: string;
  };
}

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

export function ProductSection({
  title,
  icon,
  iconClass = "text-orange-500",
  products,
  maxItems,
  isLoading,
  showControls,
  gridClassName,
  viewAllSearch,
}: ProductSectionProps) {
  const { t } = useTranslation("storefront");
  const visibleProducts = useMemo(() => (maxItems ? products?.slice(0, maxItems) : products), [maxItems, products]);
  const gridClass = gridClassName ?? GRID;

  return (
    <section className="space-y-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 uppercase dark:text-gray-100">
          <Icon icon={icon} className={iconClass} width={22} />
          {title}
        </h2>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/search"
            search={viewAllSearch ?? {}}
            className="text-ocop-800 hover:bg-ocop-light flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold transition-colors dark:text-green-400 dark:hover:bg-green-950/30"
          >
            {t("section.viewAll")}
            <Icon icon="mdi:chevron-right" width={17} />
          </Link>
          {showControls && (
            <div className="hidden items-center gap-2 md:flex">
              <span className="ring-ocop-border-soft rounded-full bg-white px-3 py-1.5 text-xs text-gray-500 shadow-sm ring-1 dark:bg-gray-900 dark:ring-gray-800">
                {t("section.sortBy")}:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{t("section.sortPopular")}</span>
              </span>
              <button
                type="button"
                aria-label={t("section.gridView")}
                className="text-ocop-800 ring-ocop-border-soft hover:bg-ocop-50 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 transition-colors dark:bg-gray-900 dark:ring-gray-800"
              >
                <Icon icon="mdi:view-grid-outline" width={17} />
              </button>
              <button
                type="button"
                aria-label={t("section.listView")}
                className="ring-ocop-border-soft hover:bg-ocop-50 hover:text-ocop-800 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm ring-1 transition-colors dark:bg-gray-900 dark:ring-gray-800"
              >
                <Icon icon="mdi:view-list" width={17} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className={gridClass}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-ocop-border-soft space-y-2 rounded-[20px] border bg-white p-2 dark:border-gray-800 dark:bg-gray-900"
            >
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : !products?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-800">
          <Icon icon="mdi:package-variant-closed-remove" className="text-gray-300" width={48} />
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t("section.emptyProducts")}</p>
        </div>
      ) : (
        <div className={gridClass}>
          {visibleProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
