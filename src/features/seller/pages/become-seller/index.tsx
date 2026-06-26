import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { SellerRegistrationForm } from "../../components/SellerRegistrationForm";
import { useCategories, useRegions } from "@/features/catalog/hooks/useCatalog";
import { useSellerStore } from "@/features/seller/store/sellerStore";
import type { SellerRegistrationDraft } from "@/features/seller/types/seller";

const BENEFIT_KEYS = ["reach", "tools", "support", "brand"] as const;
const TRUST_KEYS = ["quality", "delivery", "payment", "buyer"] as const;

export default function BecomeSellerPage() {
  const { t } = useTranslation("storefront");
  const { data: categories = [] } = useCategories();
  const { data: regions = [] } = useRegions();
  const submitRegistration = useSellerStore((state) => state.submitRegistration);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (draft: SellerRegistrationDraft) => {
    submitRegistration(draft);
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{t("sellerCenter.registerTitle")}</span>
      </nav>

      <section className="shadow-ocop rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("sellerCenter.registerHeroTitle")}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t("sellerCenter.registerDesc")}
          </p>
        </header>

        <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {submitted ? (
              <div className="flex min-h-96 flex-col items-center justify-center text-center">
                <span className="bg-ocop-light text-ocop flex h-16 w-16 items-center justify-center rounded-full dark:bg-green-950/30">
                  <Icon icon="mdi:check-circle-outline" width={38} />
                </span>
                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t("sellerCenter.registrationSuccess")}
                </h2>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  {t("sellerCenter.registrationSuccessDesc")}
                </p>
                <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
                  <Link to="/seller/dashboard">{t("sellerCenter.goDashboard")}</Link>
                </Button>
              </div>
            ) : (
              <SellerRegistrationForm categories={categories} regions={regions} onSubmit={handleSubmit} />
            )}
          </section>

          <aside className="space-y-5">
            <section className="border-ocop-100 bg-ocop-50/40 rounded-2xl border p-5 dark:border-green-900/40 dark:bg-green-950/20">
              <h2 className="text-ocop text-sm font-bold uppercase">{t("sellerCenter.benefitsTitle")}</h2>
              <div className="mt-5 space-y-5">
                {BENEFIT_KEYS.map((key) => (
                  <div key={key} className="flex gap-4">
                    <span className="bg-ocop-lighter text-ocop flex h-11 w-11 shrink-0 items-center justify-center rounded-full dark:bg-green-950/60">
                      <Icon icon={t(`sellerCenter.benefits.${key}.icon`)} width={22} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {t(`sellerCenter.benefits.${key}.title`)}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {t(`sellerCenter.benefits.${key}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-ocop-100 relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm dark:border-green-900/40 dark:bg-gray-900">
              <div className="relative z-10 max-w-[62%]">
                <h2 className="font-bold text-gray-900 dark:text-gray-100">{t("sellerCenter.support.title")}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {t("sellerCenter.support.desc")}
                </p>
                <div className="text-ocop mt-4 space-y-2 text-sm font-semibold">
                  <p className="flex items-center gap-2">
                    <Icon icon="mdi:phone-outline" width={17} />
                    {t("sellerCenter.support.phone")}
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon icon="mdi:email-outline" width={17} />
                    {t("sellerCenter.support.email")}
                  </p>
                </div>
              </div>
              <img
                src="/images/seller/customer-support-img.png"
                alt=""
                className="absolute right-0 bottom-0 h-32 w-36 object-contain object-right-bottom"
              />
            </section>
          </aside>
        </div>

        <section className="via-ocop-50 to-ocop-50 mt-6 grid gap-4 rounded-xl bg-gradient-to-r from-amber-50 p-4 sm:grid-cols-2 xl:grid-cols-4 dark:from-amber-950/20 dark:via-green-950/20 dark:to-green-950/30">
          {TRUST_KEYS.map((key) => (
            <div key={key} className="flex min-w-0 items-center gap-3">
              <span className="bg-ocop-lighter text-ocop flex h-12 w-12 shrink-0 items-center justify-center rounded-full dark:bg-green-950/60">
                <Icon icon={t(`sellerCenter.trust.${key}.icon`)} width={25} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                  {t(`sellerCenter.trust.${key}.title`)}
                </span>
                <span className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                  {t(`sellerCenter.trust.${key}.desc`)}
                </span>
              </span>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
