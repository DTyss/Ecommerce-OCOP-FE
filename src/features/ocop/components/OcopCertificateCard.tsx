import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import type { OcopCertificate } from "@/features/catalog/types/catalog";

interface OcopCertificateCardProps {
  certificate: OcopCertificate;
}

export function OcopCertificateCard({ certificate }: OcopCertificateCardProps) {
  const { t, i18n } = useTranslation("storefront");
  const issuedDate = new Intl.DateTimeFormat(i18n.language.startsWith("vi") ? "vi-VN" : "en-US", {
    dateStyle: "medium",
  }).format(new Date(certificate.issuedDate));

  return (
    <section className="border-ocop/20 dark:border-ocop/30 overflow-hidden rounded-2xl border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:bg-gray-900">
      <div className="border-ocop/10 bg-ocop-50/70 dark:border-ocop/20 flex items-center justify-between gap-4 border-b px-5 py-4 dark:bg-green-950/20">
        <div className="flex items-center gap-3">
          <span className="bg-ocop flex h-11 w-11 items-center justify-center rounded-full text-white">
            <Icon icon="mdi:certificate-outline" width={24} />
          </span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100">{t("ocop.certificate.title")}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("ocop.certificate.verified")}</p>
          </div>
        </div>
        <span className="bg-ocop-amber/15 text-ocop-amber rounded-full px-3 py-1 text-sm font-bold">
          {t("productDetail.ocopStar", { count: certificate.star })}
        </span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_180px]">
        <dl className="space-y-4">
          <CertificateField label={t("ocop.certificate.code")} value={certificate.certificateCode} />
          <CertificateField label={t("ocop.certificate.issuedBy")} value={certificate.issuedBy} />
          <CertificateField label={t("ocop.certificate.issuedDate")} value={issuedDate} />
        </dl>
        <img
          src={certificate.image}
          alt={t("ocop.certificate.imageAlt")}
          className="aspect-[4/3] w-full rounded-xl border border-gray-100 object-cover dark:border-gray-800"
        />
      </div>
    </section>
  );
}

function CertificateField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">{label}</dt>
      <dd className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );
}
