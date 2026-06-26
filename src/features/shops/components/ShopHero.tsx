import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ShopSummary } from "@/features/shops/types/shops";

interface ShopHeroProps {
  shop: ShopSummary;
}

export function ShopHero({ shop }: ShopHeroProps) {
  const { t } = useTranslation("storefront");
  const [following, setFollowing] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="bg-ocop-light px-5 py-6 sm:px-6 dark:bg-green-950/30">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="h-20 w-20 shrink-0 border-4 border-white shadow-sm dark:border-gray-800">
              <AvatarImage src={shop.avatar} alt={shop.name} />
              <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">{shop.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Icon icon="mdi:map-marker-outline" className="text-ocop" />
                {shop.region}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:star" className="text-ocop-amber" />
                  <strong className="text-gray-900 dark:text-gray-100">{shop.rating}</strong>
                </span>
                <span>{t("shop.soldCount", { count: shop.soldCount })}</span>
                <span>{t("shop.productCount", { count: shop.productCount })}</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setFollowing((value) => !value)}
            className="bg-ocop hover:bg-ocop-dark text-white"
          >
            <Icon icon={following ? "mdi:check" : "mdi:plus"} width={18} />
            {following ? t("shop.following") : t("shop.follow")}
          </Button>
        </div>
      </div>
    </section>
  );
}
