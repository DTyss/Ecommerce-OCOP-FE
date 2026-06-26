import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

const whyChooseKeys = ["authentic", "quality", "farmer", "transparent"] as const;

export function WhyChooseOcop() {
  const { t } = useTranslation("storefront");

  return (
    <section className="storefront-visual-card border-ocop-amber/25 bg-ocop-50/60 dark:border-ocop-amber/20 relative overflow-hidden rounded-2xl border p-4 shadow-sm dark:bg-green-950/20">
      <div className="bg-ocop-amber/24 dark:bg-ocop-amber/10 pointer-events-none absolute -top-16 -left-16 h-36 w-36 rounded-full blur-3xl" />
      <div className="bg-ocop/18 pointer-events-none absolute right-0 -bottom-16 h-36 w-36 rounded-full blur-2xl dark:bg-green-500/10" />
      <div className="via-ocop-amber/10 to-ocop-100/48 dark:via-ocop-amber/7 pointer-events-none absolute inset-0 bg-gradient-to-br from-white/36 dark:from-gray-900/32 dark:to-green-950/28" />

      <h2 className="relative z-10 mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-900 uppercase dark:text-gray-100">
        <Icon icon="mdi:leaf-circle" className="text-ocop" width={18} />
        {t("whyChoose.title")}
      </h2>
      <ul className="relative z-10 space-y-3">
        {whyChooseKeys.map((key) => (
          <li key={key} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
            <Icon icon="mdi:check-circle" className="text-ocop mt-0.5 shrink-0" width={18} />
            {t(`whyChoose.${key}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
