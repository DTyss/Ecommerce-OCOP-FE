import { Icon } from "@iconify/react";
import { Link, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { useProducts } from "@/features/catalog/hooks/useCatalog";
import { useOcopRegion } from "@/features/ocop/hooks/useOcop";
import { useShops } from "@/features/shops/hooks/useShops";

export default function OcopRegionDetailPage() {
  const { t } = useTranslation("storefront");
  const { regionSlug } = useParams({
    from: "/_storefront/regions/$regionSlug",
  });
  const { data: region, isLoading } = useOcopRegion(regionSlug);
  const { data: products = [] } = useProducts();
  const { data: shops = [] } = useShops();

  if (isLoading) {
    return <Skeleton className="h-[620px] rounded-3xl" />;
  }

  if (!region) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center dark:bg-gray-900">
        <Icon icon="mdi:map-marker-off-outline" className="text-gray-300" width={72} />
        <h1 className="mt-4 text-xl font-bold dark:text-gray-100">{t("ocop.regionDetail.notFound")}</h1>
        <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
          <Link to="/regions">{t("ocop.regionDetail.backToRegions")}</Link>
        </Button>
      </div>
    );
  }

  const regionProducts = products.filter((product) => product.region === region.name).slice(0, 8);
  const regionShops = shops.filter((shop) => shop.region === region.name).slice(0, 4);

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/regions" className="hover:text-ocop">
          {t("ocop.regions.title")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{region.name}</span>
      </nav>

      <section className="ocop-gradient-border relative min-h-[340px] overflow-hidden rounded-3xl shadow-[0_10px_35px_rgba(11,107,58,0.12)]">
        <img src={region.banner} alt={region.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="from-ocop-darker/90 via-ocop-darker/65 to-ocop-amber/15 absolute inset-0 bg-gradient-to-r" />
        <div className="relative flex min-h-[340px] max-w-3xl flex-col justify-end p-6 text-white md:p-10">
          <span className="bg-ocop-amber mb-3 w-fit rounded-full px-3 py-1 text-xs font-bold text-white">
            {t("ocop.regions.provinceCount", { count: region.provinceCount })}
          </span>
          <h1 className="text-3xl font-bold md:text-4xl">{region.name}</h1>
          <p className="mt-3 leading-7 text-white/90">{region.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/ocop-map"
              search={{ region: region.name }}
              className="text-ocop hover:bg-ocop-50 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold transition"
            >
              <Icon icon="mdi:map-search-outline" width={20} />
              {t("ocop.regionDetail.viewOnMap")}
            </Link>
            <Link
              to="/search"
              search={{ region: region.name }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {t("ocop.regionDetail.viewAllProducts")}
            </Link>
          </div>
        </div>
      </section>

      <section className="ocop-gradient-border bg-ocop-50/50 rounded-2xl p-5 shadow-[0_6px_24px_rgba(11,107,58,0.08)] dark:bg-green-950/15">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("ocop.regionDetail.specialties")}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {region.specialties.map((specialty) => (
            <span
              key={specialty}
              className="text-ocop inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:bg-gray-900"
            >
              <Icon icon="mdi:leaf" width={17} />
              {specialty}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("ocop.regionDetail.featuredProducts")}
        </h2>
        {regionProducts.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {regionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white p-6 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            {t("ocop.regionDetail.noProducts")}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("ocop.regionDetail.featuredShops")}</h2>
        {regionShops.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {regionShops.map((shop) => (
              <Link
                key={shop.id}
                to="/shop/$shopId"
                params={{ shopId: shop.id }}
                className="ocop-gradient-border flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-900"
              >
                <img src={shop.avatar} alt={shop.name} className="h-14 w-14 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="line-clamp-1 font-bold text-gray-900 dark:text-gray-100">{shop.name}</span>
                  <span className="text-ocop-amber mt-1 flex items-center gap-1 text-sm">
                    <Icon icon="mdi:star" width={16} />
                    {shop.rating}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white p-6 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            {t("ocop.regionDetail.noShops")}
          </p>
        )}
      </section>
    </div>
  );
}
