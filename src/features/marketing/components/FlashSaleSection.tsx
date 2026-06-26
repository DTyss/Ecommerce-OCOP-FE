import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CartActionButton } from "@/components/common/CartActionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/features/cart/store/cartStore";
import { CountdownTimer } from "@/features/marketing/components/CountdownTimer";
import { useFlashSale } from "@/features/marketing/hooks/useMarketing";
import { formatCurrency } from "@/utils/currency";

export function FlashSaleSection() {
  const { t } = useTranslation("storefront");
  const { data: campaign, isLoading } = useFlashSale();
  const addPromotionalItems = useCartStore((state) => state.addPromotionalItems);

  return (
    <section className="border-ocop-red/20 overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-red-900/30 dark:bg-gray-900">
      <div className="to-ocop-amber/10 dark:to-ocop-amber/5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-red-50 via-white px-4 py-4 sm:px-5 dark:from-red-950/25 dark:via-gray-900">
        <div className="flex items-center gap-3">
          <span className="bg-ocop-red flex h-10 w-10 items-center justify-center rounded-full text-white">
            <Icon icon="mdi:lightning-bolt" width={24} />
          </span>
          <div>
            <h2 className="text-ocop-red text-xl font-extrabold uppercase italic">{t("marketing.flashSale.title")}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("marketing.flashSale.subtitle")}</p>
          </div>
        </div>
        {campaign && <CountdownTimer endsAt={campaign.endsAt} />}
      </div>

      <div className="storefront-horizontal-scrollbar flex gap-4 overflow-x-auto p-4 sm:p-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-44 shrink-0 rounded-2xl" />
            ))
          : campaign?.items.map((item) => {
              const discount = Math.round(((item.product.price - item.salePrice) / item.product.price) * 100);
              return (
                <article
                  key={item.product.id}
                  className="w-44 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900"
                >
                  <Link to="/product/$productId" params={{ productId: item.product.id }} className="block">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        decoding="async"
                        loading="lazy"
                        className="aspect-square w-full object-cover transition hover:scale-105"
                      />
                      <span className="bg-ocop-red absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-bold text-white">
                        -{discount}%
                      </span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-ocop mt-2 text-lg font-bold">{formatCurrency(item.salePrice)}</p>
                  <p className="text-xs text-gray-400 line-through">{formatCurrency(item.product.price)}</p>
                  <div className="relative mt-2 h-4 overflow-hidden rounded-full bg-red-100 dark:bg-red-950/40">
                    <progress
                      value={item.soldPercent}
                      max={100}
                      aria-label={t("marketing.flashSale.soldPercent", {
                        percent: item.soldPercent,
                      })}
                      className="accent-ocop-red h-full w-full"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                      {item.soldPercent}%
                    </span>
                  </div>
                  <CartActionButton
                    type="button"
                    flyImageSrc={item.product.image}
                    onClick={() =>
                      addPromotionalItems([
                        {
                          product: item.product,
                          unitPrice: item.salePrice,
                          promotionType: "flashSale",
                        },
                      ])
                    }
                    className="bg-ocop hover:bg-ocop-dark mt-3 flex h-9 w-full items-center justify-center gap-1 rounded-lg text-xs font-bold text-white transition"
                  >
                    <Icon icon="mdi:cart-plus" width={17} />
                    {t("common.addToCart")}
                  </CartActionButton>
                </article>
              );
            })}
      </div>
    </section>
  );
}
