import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useShops } from "@/features/shops/hooks/useShops";
import type { ShopSummary } from "@/features/shops/types/shops";
import { cn } from "@/utils/utils";

type ShopSortKey = "popular" | "products" | "rating" | "response";

const sortOptions: ShopSortKey[] = ["popular", "products", "rating", "response"];

export default function ShopListPage() {
  const { t } = useTranslation("storefront");
  const { data: shops = [], isLoading } = useShops();
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<ShopSortKey>("popular");

  const regions = useMemo(() => Array.from(new Set(shops.map((shop) => shop.region))), [shops]);
  const categories = useMemo(() => Array.from(new Set(shops.map((shop) => shop.category))), [shops]);

  const filteredShops = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase("vi-VN");

    return shops
      .filter((shop) => {
        const matchesKeyword =
          normalizedKeyword.length === 0 ||
          [shop.name, shop.region, shop.category].join(" ").toLocaleLowerCase("vi-VN").includes(normalizedKeyword);
        const matchesRegion = region === "all" || shop.region === region;
        const matchesCategory = category === "all" || shop.category === category;

        return matchesKeyword && matchesRegion && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === "products") {
          return b.productCount - a.productCount;
        }

        if (sort === "rating") {
          return b.rating - a.rating;
        }

        if (sort === "response") {
          return parseInt(b.responseRate, 10) - parseInt(a.responseRate, 10);
        }

        return 0;
      });
  }, [category, keyword, region, shops, sort]);

  const resetFilters = () => {
    setKeyword("");
    setRegion("all");
    setCategory("all");
    setSort("popular");
  };

  return (
    <div className="space-y-6">
      <section>
        <div>
          <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-ocop">
              {t("bottomNav.home")}
            </Link>
            <Icon icon="mdi:chevron-right" width={16} />
            <span className="font-medium text-gray-900 dark:text-gray-100">{t("shop.allTitle")}</span>
          </nav>

          <h1 className="mt-7 text-3xl leading-tight font-bold text-gray-950 dark:text-white">{t("shop.allTitle")}</h1>
          <p className="mt-3 max-w-md text-base text-gray-600 dark:text-gray-300">{t("shop.allDesc")}</p>
        </div>
      </section>

      <section className="shadow-ocop rounded-2xl bg-white p-4 ring-1 ring-gray-100 sm:p-5 dark:bg-gray-900 dark:ring-gray-800">
        <div className="grid gap-3 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr_auto]">
          <label className="relative">
            <span className="sr-only">{t("shop.filter.keyword")}</span>
            <Icon
              icon="mdi:map-marker-outline"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              width={18}
            />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("shop.filter.searchPlaceholder")}
              className="h-12 rounded-xl pl-10"
            />
          </label>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-12 rounded-xl">
              <span className="flex min-w-0 items-center gap-2">
                <Icon icon="mdi:map-marker-radius-outline" width={18} />
                <SelectValue placeholder={t("shop.filter.region")} />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("shop.filter.region")}</SelectItem>
              {regions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-xl">
              <span className="flex min-w-0 items-center gap-2">
                <Icon icon="mdi:view-grid-outline" width={18} />
                <SelectValue placeholder={t("shop.filter.category")} />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("shop.filter.category")}</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => setSort(value as ShopSortKey)}>
            <SelectTrigger className="h-12 rounded-xl">
              <span className="flex min-w-0 items-center gap-2">
                <Icon icon="mdi:sort" width={18} />
                <SelectValue placeholder={t("shop.filter.sort")} />
              </span>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {t(`shop.sort.${item}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="ghost"
            className="hover:bg-ocop-light hover:text-ocop h-12 rounded-xl px-3 text-gray-500 dark:text-gray-300 dark:hover:bg-green-950/40"
            onClick={resetFilters}
          >
            <Icon icon="mdi:refresh" width={18} />
            {t("shop.filter.reset")}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-64 rounded-2xl" />)
          : filteredShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
      </section>

      {!isLoading && filteredShops.length === 0 && (
        <div className="shadow-ocop rounded-2xl bg-white p-8 text-center ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
          <Icon icon="mdi:store-search-outline" className="mx-auto text-gray-300" width={56} />
          <h2 className="mt-3 text-lg font-bold text-gray-950 dark:text-white">{t("shop.empty")}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("shop.emptyDesc")}</p>
        </div>
      )}

      <nav aria-label={t("shop.pagination")} className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((page) => (
          <Button
            key={page}
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-10 rounded-lg p-0",
              page === 1
                ? "border-ocop bg-ocop hover:bg-ocop-dark text-white"
                : "hover:border-ocop hover:text-ocop border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200",
            )}
          >
            {page}
          </Button>
        ))}
        <span className="px-2 text-gray-500">...</span>
        <Button
          type="button"
          variant="outline"
          className="hover:border-ocop hover:text-ocop h-10 w-10 rounded-lg border-gray-200 bg-white p-0 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          26
        </Button>
        <Button
          type="button"
          variant="outline"
          className="hover:border-ocop hover:text-ocop h-10 w-10 rounded-lg border-gray-200 bg-white p-0 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          aria-label={t("pagination.next")}
        >
          <Icon icon="mdi:arrow-right" width={18} />
        </Button>
      </nav>
    </div>
  );
}

function ShopCard({ shop }: { shop: ShopSummary }) {
  const { t } = useTranslation("storefront");

  return (
    <article className="group shadow-ocop hover:shadow-ocop-md overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 transition-transform hover:-translate-y-0.5 dark:bg-gray-900 dark:ring-gray-800">
      <div className="relative h-32 overflow-hidden">
        <Link to="/shop/$shopId" params={{ shopId: shop.id }}>
          <img
            src={shop.coverImage}
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {shop.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm",
              shop.badge === "featured" ? "bg-ocop" : "bg-ocop-orange",
            )}
          >
            {t(`shop.badge.${shop.badge}`)}
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("shop.addFavorite")}
          className="hover:border-ocop hover:text-ocop absolute top-3 right-3 h-9 w-9 rounded-full border-white/80 bg-white/95 text-gray-500 shadow-sm hover:bg-white"
        >
          <Icon icon="mdi:heart-outline" width={20} />
        </Button>
      </div>

      <div className="relative px-4 pt-9 pb-4">
        <Avatar className="shadow-ocop absolute -top-10 left-4 h-16 w-16 border-4 border-white dark:border-gray-900">
          <AvatarImage src={shop.avatar} alt={shop.name} />
          <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <Link to="/shop/$shopId" params={{ shopId: shop.id }} className="block">
          <h2 className="group-hover:text-ocop truncate text-lg font-bold text-gray-950 transition-colors dark:text-white">
            {shop.name}
          </h2>
        </Link>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:map-marker-outline" className="text-ocop" />
          {shop.region}
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:star" className="text-ocop-amber" />
          <span className="font-semibold text-gray-950 dark:text-white">{shop.rating}</span>
          <span>{t("productDetail.reviewCount", { count: shop.reviewCount })}</span>
        </p>

        <dl className="mt-4 grid grid-cols-3 divide-x divide-gray-200 rounded-xl bg-gray-50 p-3 text-center dark:divide-gray-700 dark:bg-gray-800/70">
          <Metric value={shop.productCount} label={t("shop.productsShort")} />
          <Metric value={shop.responseRate} label={t("shop.responseRate")} />
          <Metric value={shop.followerCount} label={t("shop.followers")} />
        </dl>
      </div>
    </article>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="min-w-0 px-2">
      <dt className="truncate text-sm font-bold text-gray-950 dark:text-white">{value}</dt>
      <dd className="truncate text-xs text-gray-500 dark:text-gray-400">{label}</dd>
    </div>
  );
}
