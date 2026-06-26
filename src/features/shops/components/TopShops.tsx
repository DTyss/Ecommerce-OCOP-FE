import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useTopShops } from "@/features/shops/hooks/useShops";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function TopShops() {
  const { t } = useTranslation("storefront");
  const { data: shops, isLoading } = useTopShops();

  return (
    <section className="storefront-visual-card border-ocop-amber/25 bg-ocop-50/65 dark:border-ocop-amber/20 relative overflow-hidden rounded-2xl border p-4 shadow-sm dark:bg-green-950/20">
      <div className="bg-ocop-amber/28 dark:bg-ocop-amber/12 pointer-events-none absolute -top-16 -right-14 h-36 w-36 rounded-full blur-2xl" />
      <div className="bg-ocop-300/30 pointer-events-none absolute -bottom-20 left-4 h-40 w-40 rounded-full blur-3xl dark:bg-green-400/10" />
      <div className="via-ocop-amber/12 to-ocop-100/52 dark:via-ocop-amber/8 pointer-events-none absolute inset-0 bg-gradient-to-br from-white/38 dark:from-gray-900/35 dark:to-green-950/30" />

      <div className="relative z-10 mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-gray-900 uppercase dark:text-gray-100">
          <Icon icon="mdi:shield-star" className="text-ocop" width={18} />
          {t("topShop.title")}
        </h2>
        <Link to="/shop" className="text-ocop flex items-center gap-0.5 text-xs font-semibold">
          {t("topShop.viewAll")}
          <Icon icon="mdi:chevron-right" width={14} />
        </Link>
      </div>

      <ul className="relative z-10 space-y-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="rounded-xl bg-white/35 p-2.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-9 w-9 rounded-xl" />
                </div>
              </li>
            ))
          : shops?.map((shop) => (
              <li
                key={shop.id}
                className="rounded-xl bg-white/38 p-2.5 transition-colors hover:bg-white/72 dark:bg-gray-900/25 dark:hover:bg-gray-900/55"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="border-ocop-light h-11 w-11 shrink-0 border-2 dark:border-green-900">
                    <AvatarImage src={shop.avatar} alt={shop.name} decoding="async" loading="lazy" />
                    <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-snug font-semibold text-gray-900 dark:text-gray-100">
                      {shop.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{shop.certificate}</p>
                  </div>
                  <Link
                    to="/shop/$shopId"
                    params={{ shopId: shop.id }}
                    aria-label={t("topShop.viewShop")}
                    className="border-ocop/25 text-ocop hover:bg-ocop flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white/80 transition-colors hover:text-white dark:border-green-900 dark:bg-gray-900/80"
                  >
                    <Icon icon="mdi:storefront-outline" width={18} />
                  </Link>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-14 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:star" className="text-ocop-gold" width={12} />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{shop.rating}</span>
                    <span>({shop.reviewCount})</span>
                  </span>
                  <span className="whitespace-nowrap">{t("topShop.sold", { count: shop.soldCount })}</span>
                </div>
              </li>
            ))}
      </ul>
    </section>
  );
}
