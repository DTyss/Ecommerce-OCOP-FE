import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ProductShopSummary } from "@/features/catalog/types/catalog";

interface ShopSummaryBlockProps {
  shop: ProductShopSummary;
}

export function ShopSummaryBlock({ shop }: ShopSummaryBlockProps) {
  const { t } = useTranslation("storefront");

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Avatar className="border-ocop-light h-14 w-14 border-2 dark:border-green-900">
          <AvatarImage src={shop.avatar} alt={shop.name} />
          <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-gray-900 dark:text-gray-100">{shop.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:star" className="text-ocop-amber" width={14} />
              {t("productDetail.shopOcopStar", {
                count: Math.round(shop.rating),
              })}
            </span>
            <span>{shop.region}</span>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-ocop text-ocop hover:bg-ocop h-9 shrink-0 rounded-lg px-4 hover:text-white"
        >
          <Link to="/shop/$shopId" params={{ shopId: shop.id }}>
            {t("topShop.viewShop")}
          </Link>
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl bg-gray-50 p-3 text-center dark:divide-gray-800 dark:bg-gray-800/60">
        <div className="px-2">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{shop.soldCount.toLocaleString("vi-VN")}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("productDetail.soldCountShort")}</p>
        </div>
        <div className="px-2">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{shop.responseRate}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("productDetail.responseRate")}</p>
        </div>
        <div className="px-2">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{shop.joinedDate}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("productDetail.joinedDate")}</p>
        </div>
      </div>
    </section>
  );
}
