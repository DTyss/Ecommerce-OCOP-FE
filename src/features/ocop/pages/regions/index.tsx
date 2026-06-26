import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useOcopRegions } from "@/features/ocop/hooks/useOcop";

export default function OcopRegionsPage() {
  const { t } = useTranslation("storefront");
  const { data: regions = [], isLoading } = useOcopRegions();

  return (
    <div className="space-y-8">
      <section className="ocop-gradient-border bg-ocop-50 relative overflow-hidden rounded-3xl px-6 py-12 shadow-[0_10px_35px_rgba(11,107,58,0.10)] md:px-10 dark:bg-green-950/20">
        <img
          src="/images/background/footer-landscape-bg-optimized.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-20"
        />
        <div className="from-ocop-50/95 via-ocop-50/70 to-ocop-amber/20 dark:to-ocop-amber/10 absolute inset-0 bg-gradient-to-r dark:from-gray-950/90 dark:via-green-950/70" />
        <div className="relative max-w-3xl">
          <span className="text-ocop inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold shadow-sm dark:bg-gray-900/80">
            <Icon icon="mdi:map-marker-radius-outline" width={18} />
            {t("ocop.regions.eyebrow")}
          </span>
          <h1 className="text-ocop-darker mt-4 text-3xl font-bold md:text-4xl dark:text-green-200">
            {t("ocop.regions.title")}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-300">{t("ocop.regions.subtitle")}</p>
          <Link
            to="/ocop-map"
            search={{}}
            className="bg-ocop hover:bg-ocop-dark mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition"
          >
            <Icon icon="mdi:map-search-outline" width={20} />
            {t("ocop.regions.openMap")}
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("ocop.regions.allRegions")}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("ocop.regions.allRegionsDesc")}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-2xl" />)
            : regions.map((region) => (
                <Link
                  key={region.slug}
                  to="/regions/$regionSlug"
                  params={{ regionSlug: region.slug }}
                  className="ocop-gradient-border group overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(11,107,58,0.14)] dark:bg-gray-900"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={region.image}
                      alt={region.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="from-ocop-darker/75 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{region.name}</h3>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-3 min-h-[60px] text-sm leading-5 text-gray-600 dark:text-gray-300">
                      {region.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Icon icon="mdi:map-marker-multiple-outline" width={18} />
                        {t("ocop.regions.provinceCount", {
                          count: region.provinceCount,
                        })}
                      </span>
                      <span className="text-ocop font-semibold">
                        {t("common.viewDetail")}
                        <Icon icon="mdi:chevron-right" className="inline" width={17} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>
    </div>
  );
}
