import { useTranslation } from "react-i18next";
import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { CartActionButton } from "@/components/common/CartActionButton";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import type { Product } from "@/features/catalog/types/catalog";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function ProductCardBase({ product, className }: ProductCardProps) {
  const { t } = useTranslation("storefront");
  const addItem = useCartStore((state) => state.addItem);
  const wishlisted = useWishlistStore((state) => state.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const hasDiscount = Boolean(product.discountPercent);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className={cn(
        "group border-ocop-border-soft relative flex h-full flex-col overflow-hidden rounded-[20px] border bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:border-gray-800 dark:bg-gray-900",
        "storefront-visual-card",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2">
          <span className="flex flex-wrap gap-1.5">
            {hasDiscount ? (
              <span className="bg-ocop-red rounded-lg px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                -{product.discountPercent}%
              </span>
            ) : (
              <>
                {product.badge === "hot" && (
                  <span className="bg-ocop-orange rounded-lg px-2 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
                    {t("product.hot")}
                  </span>
                )}
                {product.badge === "new" && (
                  <span className="bg-ocop rounded-lg px-2 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
                    {t("product.new")}
                  </span>
                )}
              </>
            )}
          </span>
        </div>
        <FavoriteButton
          aria-label={wishlisted ? t("product.removeWishlist") : t("product.addWishlist")}
          active={wishlisted}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="hover:text-ocop-red absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/90 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900/90"
          iconClassName="h-[19px] w-[19px]"
        />
        <img
          src={product.image}
          alt={product.name}
          decoding="async"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-2.5 pb-1">
        <h3 className="group-hover:text-ocop-800 line-clamp-2 min-h-[2.55rem] text-[15px] leading-[1.35] font-semibold text-gray-900 xl:text-base dark:text-gray-100">
          {product.name}
        </h3>

        <span className="mt-1.5 flex w-fit items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:medal-outline" className="text-ocop-amber" width={13} />
          {t("product.ocopStar", { star: product.ocopStar })}
        </span>

        <div className="mt-1.5 flex min-h-[2rem] flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-ocop-800 [font-size:clamp(20px,1.65vw,30px)] leading-none font-bold tracking-tight whitespace-nowrap">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-medium whitespace-nowrap text-gray-400 line-through dark:text-gray-500">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
          <span className="flex min-w-0 items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:star" className="text-ocop-amber" width={14} />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </span>
          <CartActionButton
            type="button"
            aria-label={t("product.addToCart")}
            flyImageSrc={product.image}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            variant="outline"
            size="icon"
            className="text-ocop-800 hover:border-ocop-800 hover:bg-ocop-800 dark:hover:bg-ocop-800 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-colors hover:text-white dark:border-gray-700 dark:bg-gray-900"
          >
            <Icon icon="mdi:cart-plus" width={18} />
          </CartActionButton>
        </div>
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardBase);
