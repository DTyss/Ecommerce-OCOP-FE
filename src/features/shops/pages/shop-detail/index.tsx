import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ProductSortSelect } from "@/features/discovery/components/ProductSortSelect";
import { useShopDetail, useShopProducts } from "@/features/shops/hooks/useShops";
import type { Product, ProductSortKey } from "@/features/catalog/types/catalog";
import type { ShopSummary } from "@/features/shops/types/shops";
import { cn } from "@/utils/utils";

type ShopDetailTab = "products" | "about" | "reviews" | "faq";

const tabs: ShopDetailTab[] = ["products", "about", "reviews", "faq"];

export default function ShopDetailPage() {
  const { t, i18n } = useTranslation("storefront");
  const { shopId } = useParams({ from: "/_storefront/shop/$shopId" });
  const { data: shop, isLoading: isShopLoading } = useShopDetail(shopId);
  const { data: products = [], isLoading: isProductsLoading } = useShopProducts(shopId);
  const [sort, setSort] = useState<ProductSortKey>("popular");
  const [activeTab, setActiveTab] = useState<ShopDetailTab>("products");

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.language === "vi" ? "vi-VN" : "en-US"),
    [i18n.language],
  );

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);

  if (!isShopLoading && !shop) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Icon icon="mdi:store-remove-outline" className="text-gray-300" width={72} />
        <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{t("shop.notFound")}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("shop.notFoundDesc")}</p>
        <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
          <Link to="/">{t("common.backHome")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <Link to="/shop" className="hover:text-ocop">
          {t("shop.allTitle")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{shop?.name ?? t("common.loading")}</span>
      </nav>

      {shop ? (
        <>
          <ShopDetailHero shop={shop} productCount={numberFormatter.format(shop.productCount)} />
          <ShopStatBar shop={shop} productCount={numberFormatter.format(shop.productCount)} />
        </>
      ) : (
        <div className="shadow-ocop h-64 rounded-2xl bg-white ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800" />
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="shadow-ocop min-w-0 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
          <div className="flex gap-8 overflow-x-auto border-b border-gray-100 px-5 dark:border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "hover:text-ocop relative h-14 shrink-0 text-sm font-medium text-gray-500 transition-colors dark:text-gray-400",
                  activeTab === tab && "text-ocop dark:text-ocop-300",
                )}
              >
                {t(`shop.detail.tabs.${tab}`)}
                {tab === "reviews" && shop ? ` (${shop.reviewCount})` : ""}
                {activeTab === tab && <span className="bg-ocop absolute inset-x-0 bottom-0 h-0.5 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "products" && (
              <ProductTab
                products={sortedProducts}
                isLoading={isProductsLoading || isShopLoading}
                sort={sort}
                onSortChange={setSort}
                shop={shop ?? undefined}
              />
            )}

            {activeTab === "about" && shop && <AboutSection shop={shop} />}
            {activeTab === "reviews" && shop && <ReviewSummary shop={shop} />}
            {activeTab === "faq" && <FaqSection />}
          </div>
        </main>

        {shop && <ShopSidebar shop={shop} />}
      </div>
    </div>
  );
}

function ShopDetailHero({ shop, productCount }: { shop: ShopSummary; productCount: string }) {
  const { t } = useTranslation("storefront");
  const [following, setFollowing] = useState(false);

  return (
    <section className="shadow-ocop relative isolate min-h-[250px] overflow-hidden rounded-2xl bg-gray-950">
      <img
        src={shop.coverImage}
        alt={shop.name}
        className="absolute inset-0 z-[-2] h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      <div className="flex min-h-[250px] flex-col justify-end gap-5 p-5 sm:p-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative w-fit shrink-0 pb-3">
            <Avatar className="shadow-ocop relative z-0 h-28 w-28 border-4 border-white">
              <AvatarImage src={shop.avatar} alt={shop.name} />
              <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-ocop ring-ocop/10 absolute bottom-0 left-1/2 z-10 block w-max -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm ring-1">
              {t("shop.detail.trusted")}
            </span>
          </div>

          <div className="min-w-0 pb-1 text-white">
            <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl">{shop.name}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <Icon icon="mdi:map-marker-outline" width={18} />
              {shop.region}, {shop.address}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/95">
              <span className="flex items-center gap-1">
                <Icon icon="mdi:star" className="text-ocop-amber" />
                <strong>{shop.rating}</strong>
                {t("productDetail.reviewCount", {
                  count: shop.reviewCount,
                })}
              </span>
              <span>{t("shop.productCount", { count: `${productCount}+` })}</span>
              <span>{t("shop.followerCount", { count: shop.followerCount })}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => setFollowing((value) => !value)}
            className="bg-ocop hover:bg-ocop-dark h-11 rounded-lg px-6 text-white"
          >
            <Icon icon={following ? "mdi:check" : "mdi:plus"} width={18} />
            {following ? t("shop.following") : t("shop.follow")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hover:text-ocop h-11 rounded-lg border-white/70 bg-white/10 px-6 text-white hover:bg-white"
          >
            <Icon icon="mdi:message-outline" width={18} />
            {t("shop.detail.message")}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ShopStatBar({ shop, productCount }: { shop: ShopSummary; productCount: string }) {
  const { t } = useTranslation("storefront");
  const joinedYear = shop.joinedDate.split("-")[0];
  const items = [
    {
      key: "products",
      icon: "mdi:storefront-outline",
      value: `${productCount}+`,
      label: t("shop.productsShort"),
    },
    {
      key: "response",
      icon: "mdi:thumb-up-outline",
      value: shop.responseRate,
      label: t("shop.detail.positiveResponse"),
    },
    {
      key: "rating",
      icon: "mdi:star-outline",
      value: `${shop.rating} / 5`,
      label: t("shop.detail.shopRating"),
    },
    {
      key: "followers",
      icon: "mdi:account-group-outline",
      value: shop.followerCount,
      label: t("shop.followers"),
    },
    {
      key: "joined",
      icon: "mdi:calendar-month-outline",
      value: joinedYear,
      label: t("shop.detail.joinedFrom"),
    },
  ];

  return (
    <section className="shadow-ocop grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-100 sm:grid-cols-2 xl:grid-cols-5 dark:bg-gray-900 dark:ring-gray-800">
      {items.map((item) => (
        <div
          key={item.key}
          className="flex min-w-0 items-center gap-3 border-gray-100 px-2 py-1 xl:border-r xl:last:border-r-0 dark:border-gray-800"
        >
          <span className="bg-ocop-light text-ocop dark:text-ocop-300 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl dark:bg-green-950/40">
            <Icon icon={item.icon} width={24} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-950 dark:text-white">{item.value}</p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function ProductTab({
  products,
  isLoading,
  sort,
  onSortChange,
  shop,
}: {
  products: Product[];
  isLoading: boolean;
  sort: ProductSortKey;
  onSortChange: (value: ProductSortKey) => void;
  shop: ShopSummary | undefined;
}) {
  const { t } = useTranslation("storefront");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">{t("shop.detail.featuredProducts")}</h2>
        <ProductSortSelect value={sort} onChange={onSortChange} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {shop && <AboutSection shop={shop} />}
    </div>
  );
}

function ShopSidebar({ shop }: { shop: ShopSummary }) {
  const { t } = useTranslation("storefront");
  const infoItems = [
    {
      icon: "mdi:map-marker-outline",
      label: t("shop.detail.address"),
      value: shop.address,
    },
    {
      icon: "mdi:phone-outline",
      label: t("shop.detail.phone"),
      value: shop.phone,
    },
    {
      icon: "mdi:email-outline",
      label: t("shop.detail.email"),
      value: shop.email,
    },
    {
      icon: "mdi:clock-outline",
      label: t("shop.detail.openingHours"),
      value: shop.openingHours,
    },
    {
      icon: "mdi:certificate-outline",
      label: t("shop.detail.certificate"),
      value: shop.certificate,
    },
  ];

  return (
    <aside className="space-y-4">
      <section className="shadow-ocop rounded-2xl bg-white p-5 ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white">{t("shop.detail.shopInfo")}</h2>
        <dl className="mt-5 space-y-4">
          {infoItems.map((item) => (
            <div key={item.label} className="flex gap-3">
              <dt className="pt-0.5 text-gray-400">
                <Icon icon={item.icon} width={18} />
              </dt>
              <dd>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.label}</p>
                <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">{item.value}</p>
              </dd>
            </div>
          ))}
        </dl>
        <Button type="button" variant="ghost" className="text-ocop hover:text-ocop-dark mt-4 px-0 hover:bg-transparent">
          {t("shop.detail.viewCertificate")}
          <Icon icon="mdi:arrow-right" width={16} />
        </Button>
      </section>

      <section className="shadow-ocop rounded-2xl bg-white p-5 ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white">{t("shop.detail.shopCategories")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {shop.categoryTags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function AboutSection({ shop }: { shop: ShopSummary }) {
  const { t } = useTranslation("storefront");

  return (
    <section className="shadow-ocop grid gap-5 rounded-2xl bg-white p-5 ring-1 ring-gray-100 lg:grid-cols-[minmax(0,1fr)_420px] dark:bg-gray-900 dark:ring-gray-800">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">{t("shop.detail.aboutTitle")}</h2>
        <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">{shop.description}</p>
      </div>
      <img src={shop.coverImage} alt={shop.name} className="h-56 w-full rounded-xl object-cover" />
    </section>
  );
}

function ReviewSummary({ shop }: { shop: ShopSummary }) {
  const { t } = useTranslation("storefront");

  return (
    <section className="bg-ocop-light rounded-2xl p-6 dark:bg-green-950/30">
      <h2 className="text-xl font-bold text-gray-950 dark:text-white">{t("shop.detail.reviewsTitle")}</h2>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        {t("shop.detail.reviewsDesc", {
          rating: shop.rating,
          count: shop.reviewCount,
        })}
      </p>
    </section>
  );
}

function FaqSection() {
  const { t } = useTranslation("storefront");
  const items = ["shipping", "certificate", "return"] as const;

  return (
    <section className="space-y-3">
      {items.map((item) => (
        <div key={item} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-950 dark:text-white">{t(`shop.detail.faq.${item}.question`)}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t(`shop.detail.faq.${item}.answer`)}
          </p>
        </div>
      ))}
    </section>
  );
}

function sortProducts(products: Product[], sort: ProductSortKey) {
  return [...products].sort((a, b) => {
    if (sort === "priceAsc") {
      return a.price - b.price;
    }

    if (sort === "priceDesc") {
      return b.price - a.price;
    }

    if (sort === "ratingDesc") {
      return b.rating - a.rating;
    }

    if (sort === "newest") {
      return b.id.localeCompare(a.id);
    }

    return b.soldCount - a.soldCount;
  });
}
