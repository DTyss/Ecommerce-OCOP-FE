import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import type { ProductTraceability } from "@/features/catalog/types/catalog";

interface TraceabilityCardProps {
  traceability: ProductTraceability;
}

export function TraceabilityCard({ traceability }: TraceabilityCardProps) {
  const { t, i18n } = useTranslation("storefront");
  const productionDate = new Intl.DateTimeFormat(i18n.language.startsWith("vi") ? "vi-VN" : "en-US", {
    dateStyle: "medium",
  }).format(new Date(traceability.productionDate));

  const fields = [
    ["mdi:barcode", t("ocop.traceability.batchCode"), traceability.batchCode],
    ["mdi:factory", t("ocop.traceability.producer"), traceability.producer],
    ["mdi:calendar-check-outline", t("ocop.traceability.productionDate"), productionDate],
    ["mdi:sprout-outline", t("ocop.traceability.materialRegion"), traceability.materialRegion],
  ] as const;

  return (
    <section className="border-ocop/20 dark:border-ocop/30 rounded-2xl border bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <span className="bg-ocop flex h-11 w-11 items-center justify-center rounded-full text-white">
          <Icon icon="mdi:qrcode-scan" width={24} />
        </span>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100">{t("ocop.traceability.title")}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("ocop.traceability.subtitle")}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[144px_minmax(0,1fr)]">
        <div className="flex flex-col items-center rounded-xl bg-white p-3 ring-1 ring-gray-100 dark:ring-gray-700">
          <QRCode value={traceability.qrValue} size={112} />
          <span className="mt-2 text-center text-xs font-medium text-gray-500">{t("ocop.traceability.scan")}</span>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {fields.map(([icon, label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
              <dt className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Icon icon={icon} className="text-ocop" width={17} />
                {label}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
