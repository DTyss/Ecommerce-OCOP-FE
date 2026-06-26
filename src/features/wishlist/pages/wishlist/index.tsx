import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ProductSkeleton } from "@/features/catalog/components/ProductSkeleton";
import { useProducts } from "@/features/catalog/hooks/useCatalog";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { t } = useTranslation("storefront");
  const productIds = useWishlistStore((state) => state.productIds);
  const { data: products, isLoading } = useProducts();
  const wishlistedProducts = useMemo(
    () => (products ?? []).filter((product) => productIds.includes(product.id)),
    [productIds, products],
  );

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("wishlist.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("wishlist.count", { count: wishlistedProducts.length })}
        </p>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <section className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Icon icon="mdi:heart-off-outline" className="text-gray-300 dark:text-gray-700" width={72} />
          <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-100">{t("wishlist.empty")}</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("wishlist.emptyDesc")}</p>
          <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
            <Link to="/">{t("cart.continueShopping")}</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
