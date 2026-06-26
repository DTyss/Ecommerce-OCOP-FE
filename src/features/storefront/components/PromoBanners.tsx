import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/utils";

const promoBanners = [
  {
    id: "ocop5",
    key: "ocop5",
    accentClass:
      "from-ocop-50 via-white to-ocop-amber/18 dark:from-green-950/40 dark:via-gray-900 dark:to-ocop-amber/10",
  },
  {
    id: "daily",
    key: "daily",
    accentClass:
      "from-ocop-amber/16 via-white to-ocop-50 dark:from-ocop-amber/10 dark:via-gray-900 dark:to-green-950/30",
  },
  {
    id: "freeship",
    key: "freeship",
    accentClass: "from-ocop-50 via-white to-ocop-100 dark:from-green-950/40 dark:via-gray-900 dark:to-green-900/30",
  },
];

const META: Record<string, { icon: string; iconClass: string }> = {
  ocop5: { icon: "mdi:star-circle", iconClass: "text-ocop" },
  daily: { icon: "mdi:sale", iconClass: "text-amber-500" },
  freeship: { icon: "mdi:truck-fast", iconClass: "text-emerald-600" },
};

export function PromoBanners() {
  const { t } = useTranslation("storefront");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {promoBanners.map((banner) => (
        <div
          key={banner.id}
          className={cn(
            "group border-ocop-amber/35 ring-ocop-amber/10 hover:border-ocop-amber/55 dark:border-ocop-amber/20 dark:ring-ocop-amber/5 relative flex min-h-[118px] items-center justify-between gap-4 overflow-hidden rounded-[20px] border bg-gradient-to-br p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
            "storefront-visual-card",
            banner.accentClass,
          )}
        >
          <div className="bg-ocop-amber/20 pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl" />
          <div className="bg-ocop/14 pointer-events-none absolute -bottom-12 left-4 h-28 w-28 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-ocop-800 text-lg font-bold dark:text-green-300">{t(`promo.${banner.key}.title`)}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t(`promo.${banner.key}.desc`)}</p>
            <button
              type="button"
              className="bg-ocop-800 hover:bg-ocop-dark mt-3 inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              {t(`promo.${banner.key}.cta`)}
              <Icon icon="mdi:arrow-right" width={14} />
            </button>
          </div>
          <Icon
            icon={META[banner.key].icon}
            className={cn(
              "relative z-10 shrink-0 opacity-80 transition-transform duration-300 group-hover:scale-110",
              META[banner.key].iconClass,
            )}
            width={52}
          />
        </div>
      ))}
    </div>
  );
}
