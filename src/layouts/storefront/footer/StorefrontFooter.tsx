import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { StorefrontLogo } from "../header/StorefrontLogo";

const footerColumns = [
  {
    titleKey: "footer.columns.about.title",
    links: [
      "footer.columns.about.items.intro",
      "footer.columns.about.items.news",
      "footer.columns.about.items.partner",
      "footer.columns.about.items.contact",
    ],
  },
  {
    titleKey: "footer.columns.policy.title",
    links: [
      "footer.columns.policy.items.privacy",
      "footer.columns.policy.items.return",
      "footer.columns.policy.items.shipping",
      "footer.columns.policy.items.terms",
      "footer.columns.policy.items.faq",
    ],
  },
] as const;

const socials = [
  { icon: "logos:facebook", label: "Facebook" },
  { icon: "simple-icons:zalo", label: "Zalo" },
  { icon: "logos:youtube-icon", label: "YouTube" },
  { icon: "ic:baseline-tiktok", label: "TikTok" },
] as const;

const payments = [
  { label: "VNPAY", className: "text-blue-600" },
  { label: "MoMo", className: "text-pink-600" },
] as const;

export function StorefrontFooter() {
  const { t } = useTranslation("storefront");

  return (
    <footer className="border-ocop-100 bg-ocop-50/40 relative isolate mt-10 overflow-hidden border-t text-gray-700 shadow-[0_-10px_32px_rgba(15,23,42,0.1)] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:shadow-[0_-10px_32px_rgba(0,0,0,0.42)]">
      <img
        src="/images/background/footer-landscape-bg-optimized.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[-2] h-full w-full object-cover object-bottom opacity-100 contrast-105 saturate-105 dark:opacity-20 dark:contrast-100 dark:saturate-100"
      />
      <div className="pointer-events-none absolute inset-0 z-[-1] bg-gradient-to-b from-white/66 via-white/30 to-white/6 dark:from-gray-950/78 dark:via-gray-950/78 dark:to-gray-950/78" />

      <section className="border-ocop-100/70 relative z-10 border-t bg-white/10 dark:border-gray-800 dark:bg-gray-950/34">
        <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1.35fr_0.85fr_0.95fr_1.3fr_0.9fr]">
          <div>
            <StorefrontLogo className="mb-5" />
            <p className="max-w-sm text-sm leading-7 text-gray-600 dark:text-gray-400">
              {t("footer.about.p1")} {t("footer.about.p2")}
            </p>

            <h2 className="mt-7 text-sm font-bold text-gray-900 dark:text-gray-100">{t("footer.social.title")}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="hover:border-ocop/40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
                >
                  <Icon icon={social.icon} width={22} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.titleKey}>
              <h2 className="text-ocop text-sm font-bold uppercase">{t(column.titleKey)}</h2>
              <span className="bg-ocop mt-2 block h-0.5 w-7 rounded-full" />
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((linkKey) => (
                  <li key={linkKey}>
                    <a href="#" className="hover:text-ocop transition">
                      {t(linkKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-ocop text-sm font-bold uppercase">{t("footer.contact.title")}</h2>
            <span className="bg-ocop mt-2 block h-0.5 w-7 rounded-full" />
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <Icon icon="mdi:map-marker-outline" className="text-ocop mt-0.5 shrink-0" width={18} />
                <span>{t("footer.contact.address")}</span>
              </li>
              <li className="flex gap-3">
                <Icon icon="mdi:phone-outline" className="text-ocop mt-0.5 shrink-0" width={18} />
                <span>{t("footer.contact.phone")}</span>
              </li>
              <li className="flex gap-3">
                <Icon icon="mdi:email-outline" className="text-ocop mt-0.5 shrink-0" width={18} />
                <span>{t("footer.contact.email")}</span>
              </li>
              <li className="flex gap-3">
                <Icon icon="mdi:clock-outline" className="text-ocop mt-0.5 shrink-0" width={18} />
                <span>{t("footer.contact.hours")}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-ocop text-sm font-bold uppercase">{t("footer.certified")}</h2>
            <span className="bg-ocop mt-2 block h-0.5 w-7 rounded-full" />
            <div className="border-ocop-100 mt-5 rounded-xl border bg-white/78 p-4 text-center shadow-sm dark:border-green-900/40 dark:bg-gray-900/74">
              <p className="mt-2 text-2xl font-extrabold tracking-tight">
                <span className="text-ocop-red">O</span>
                <span className="text-ocop">C</span>
                <span className="text-blue-500">O</span>
                <span className="text-ocop-amber">P</span>
              </p>
              <p className="text-ocop-red text-[10px] font-semibold uppercase">One Commune One Product</p>
              <div className="text-ocop-amber mt-2 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} icon="mdi:star" width={16} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ocop pb-20 text-white xl:pb-0">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm">
            <Icon icon="mdi:leaf" width={16} />
            <span>{t("footer.copyright")}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {payments.map((payment) => (
              <span
                key={payment.label}
                className="flex h-9 min-w-12 items-center justify-center rounded-md bg-white px-2 text-xs font-extrabold shadow-sm"
              >
                <span className={payment.className}>{payment.label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}
