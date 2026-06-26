import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import type { SellerDashboardMetric } from "@/features/seller/types/seller";
import { cn } from "@/utils/utils";

interface SellerDashboardStatsProps {
  metrics: SellerDashboardMetric[];
}

const toneClass = {
  green: "bg-ocop-light text-ocop dark:bg-green-950/30",
  amber: "bg-amber-50 text-ocop-amber dark:bg-amber-950/30",
  blue: "bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-300",
  red: "bg-red-50 text-ocop-red dark:bg-red-950/30",
};

export function SellerDashboardStats({ metrics }: SellerDashboardStatsProps) {
  const { t } = useTranslation("storefront");

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClass[metric.tone])}>
            <Icon icon={metric.icon} width={22} />
          </span>
          <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t(metric.labelKey)}</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
        </div>
      ))}
    </section>
  );
}
