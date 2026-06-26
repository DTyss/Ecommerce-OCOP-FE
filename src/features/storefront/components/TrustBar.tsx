import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

const trustItems = [
  { id: "commitment", icon: "mdi:shield-check-outline", key: "commitment" },
  { id: "shipping", icon: "mdi:truck-fast-outline", key: "shipping" },
  { id: "return", icon: "mdi:autorenew", key: "return" },
  { id: "payment", icon: "mdi:credit-card-check-outline", key: "payment" },
  { id: "support", icon: "mdi:headset", key: "support" },
];

export function TrustBar() {
  const { t } = useTranslation("storefront");

  return (
    <section className="border-ocop/20 bg-ocop-50/70 rounded-2xl border px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:px-5 dark:border-green-900/60 dark:bg-green-950/20">
      <div className="lg:divide-ocop/15 grid grid-cols-1 gap-y-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0 lg:divide-x lg:dark:divide-gray-800">
        {trustItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-left lg:px-3 first:lg:pl-2 last:lg:pr-2 xl:px-4">
            <span className="text-ocop flex h-10 w-10 shrink-0 items-center justify-center dark:text-green-400">
              <Icon icon={item.icon} width={34} />
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-tight font-semibold text-gray-900 xl:text-base dark:text-gray-100">
                {t(`trust.${item.key}.title`)}
              </p>
              <p className="mt-1 text-xs leading-tight text-gray-500 xl:text-sm dark:text-gray-400">
                {t(`trust.${item.key}.desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
