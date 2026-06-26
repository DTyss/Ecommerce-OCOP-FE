import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/features/catalog/types/catalog";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductResultsProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductResults({ products, isLoading }: ProductResultsProps) {
  const { t } = useTranslation("storefront");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-2 rounded-xl bg-white p-2 shadow-sm dark:bg-gray-900">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <Icon icon="mdi:magnify-close" className="text-gray-300" width={64} />
        <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t("search.empty")}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("search.emptyDesc")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
