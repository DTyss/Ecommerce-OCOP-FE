import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import type { ShopSummary } from "@/features/shops/types/shops";

interface ShopStatsProps {
  shop: ShopSummary;
}

export function ShopStats({ shop }: ShopStatsProps) {
  const { t } = useTranslation("storefront");
  const items = [
    {
      key: "rating",
      icon: "mdi:star-outline",
      label: t("shop.rating"),
      value: shop.rating,
    },
    {
      key: "sold",
      icon: "mdi:shopping-outline",
      label: t("productDetail.soldCountShort"),
      value: shop.soldCount,
    },
    {
      key: "response",
      icon: "mdi:message-reply-text-outline",
      label: t("shop.responseRate"),
      value: shop.responseRate,
    },
    {
      key: "joined",
      icon: "mdi:calendar-month-outline",
      label: t("shop.joinedDate"),
      value: shop.joinedDate,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <span className="bg-ocop-light text-ocop flex h-10 w-10 items-center justify-center rounded-xl dark:bg-green-950/30">
            <Icon icon={item.icon} width={22} />
          </span>
          <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
