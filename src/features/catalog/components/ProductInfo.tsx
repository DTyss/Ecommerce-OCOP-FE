import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { CartActionButton } from "@/components/common/CartActionButton";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./QuantitySelector";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import type { ProductDetail } from "@/features/catalog/types/catalog";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

interface ProductInfoProps {
  product: ProductDetail;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
}

export function ProductInfo({ product, onAddToCart, onBuyNow }: ProductInfoProps) {
  const { t } = useTranslation("storefront");
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("100g");
  const wishlisted = useWishlistStore((state) => state.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const outOfStock = product.stock <= 0;
  const weights = ["50g", "100g", "200g", "500g"];
  const activeViewers = Math.max(12, Math.min(38, Math.round(product.stock * 0.9)));
  const recentOrders = Math.max(6, Math.round(product.soldCount / 54));

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-ocop-amber inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold dark:bg-amber-950/30">
            <Icon icon="mdi:medal-outline" width={14} />
            {t("productDetail.ocopStar", { count: product.ocopStar })}
          </span>
          {product.discountPercent && (
            <span className="bg-ocop-red rounded-full px-2.5 py-1 text-xs font-bold text-white">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl leading-tight font-bold text-gray-900 md:text-3xl dark:text-gray-100">
            {product.name}
          </h1>
          <FavoriteButton
            aria-label={wishlisted ? t("product.removeWishlist") : t("product.addWishlist")}
            active={wishlisted}
            onClick={() => toggleWishlist(product.id)}
            className={cn(
              "hover:text-ocop-red flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
              wishlisted && "text-ocop-red",
            )}
            iconClassName="h-[22px] w-[22px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{product.rating.toFixed(1)}</span>
            {Array.from({ length: 5 }).map((_, index) => (
              <Icon
                key={index}
                icon={index + 1 <= Math.round(product.rating) ? "mdi:star" : "mdi:star-outline"}
                className="text-ocop-amber"
                width={15}
              />
            ))}
          </span>
          <span>{t("productDetail.reviewCount", { count: product.reviewCount })}</span>
          <span className="hidden h-4 w-px bg-gray-200 sm:block dark:bg-gray-700" />
          <span>{t("productDetail.soldCount", { count: product.soldCount })}</span>
        </div>

        <div>
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-ocop text-4xl leading-none font-bold">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="pb-1 text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("productDetail.vatIncluded")}</p>
        </div>

        <div className="bg-ocop-light/80 text-ocop grid gap-2 rounded-xl p-3 text-xs font-semibold sm:grid-cols-3 dark:bg-green-950/20">
          <span className="flex items-center gap-2">
            <Icon icon="mdi:eye-outline" width={16} />
            {t("productDetail.activeViewers", { count: activeViewers })}
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="mdi:clock-outline" width={16} />
            {t("productDetail.recentOrders", { count: recentOrders })}
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="mdi:check-circle-outline" width={16} />
            {t("productDetail.inStockWithCount", { count: product.stock })}
          </span>
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("productDetail.weight")}</p>
          <div className="grid grid-cols-4 gap-2">
            {weights.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => setSelectedWeight(weight)}
                className={cn(
                  "h-11 rounded-lg border bg-white text-sm font-semibold text-gray-700 transition-colors dark:bg-gray-900 dark:text-gray-200",
                  selectedWeight === weight
                    ? "border-ocop bg-ocop-light text-ocop ring-ocop/15 ring-2 dark:bg-green-950/30"
                    : "hover:border-ocop/50 border-gray-200 dark:border-gray-800",
                )}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("common.quantity")}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {outOfStock
                ? t("productDetail.outOfStock")
                : t("productDetail.inStockWithCount", { count: product.stock })}
            </p>
          </div>
          <QuantitySelector value={quantity} max={Math.max(product.stock, 1)} onChange={setQuantity} />
        </div>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <CartActionButton
            type="button"
            variant="outline"
            size="lg"
            disabled={outOfStock}
            flyImageSrc={product.image}
            onClick={() => onAddToCart(quantity)}
            className="border-ocop text-ocop hover:bg-ocop h-14 rounded-lg hover:text-white"
          >
            <Icon icon="mdi:cart-plus" width={18} />
            {t("common.addToCart")}
          </CartActionButton>
          <Button
            type="button"
            size="lg"
            disabled={outOfStock}
            onClick={() => onBuyNow(quantity)}
            className="bg-ocop hover:bg-ocop-dark h-14 rounded-lg text-white"
          >
            <span className="flex flex-col leading-tight">
              <span>{t("common.buyNow")}</span>
              <span className="text-xs font-normal text-white/80">{t("productDetail.fastDelivery")}</span>
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
