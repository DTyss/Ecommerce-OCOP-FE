import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { ActiveFilterChips } from "../../components/ActiveFilterChips";
import { ProductFilterPanel } from "../../components/ProductFilterPanel";
import { ProductPagination } from "../../components/ProductPagination";
import { ProductSortSelect } from "../../components/ProductSortSelect";
import { ProductResults } from "@/features/catalog/components/ProductResults";
import { useCategories, useProducts } from "@/features/catalog/hooks/useCatalog";
import {
  DEFAULT_PAGE_SIZE,
  discoverProducts,
  getPriceBounds,
  getUniqueRegions,
  hasActiveDiscoveryFilters,
  normalizeDiscoveryParams,
  serializeDiscoveryParams,
} from "../../utils/productDiscovery";
import type {
  Category,
  Product,
  ProductDiscoveryFilters,
  ProductDiscoveryParams,
  ProductSortKey,
} from "@/features/catalog/types/catalog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function CategoryListPage() {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const search = useSearch({ from: "/_storefront/category" });
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const [filterOpen, setFilterOpen] = useState(false);

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const params = useMemo(
    () =>
      normalizeDiscoveryParams({
        ...search,
        category: "",
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    [search],
  );
  const result = useMemo(() => discoverProducts(products, params), [params, products]);
  const regions = useMemo(() => getUniqueRegions(products), [products]);
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);
  const categoryCounts = useMemo(() => getCategoryCounts(products, categories), [categories, products]);
  const ratingCounts = useMemo(() => getRatingCounts(products), [products]);
  const hasFilters = hasActiveDiscoveryFilters({
    ...params,
    category: "",
    keyword: "",
  });

  const updateSearch = (updates: Partial<ProductDiscoveryParams>) => {
    const targetSlug = updates.category ?? "";
    const next = normalizeDiscoveryParams({
      ...params,
      ...updates,
      category: "",
      keyword: "",
      page: updates.page ?? 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    const searchParams = serializeDiscoveryParams({
      ...next,
      category: "",
      keyword: "",
    });

    if (updates.category !== undefined && targetSlug) {
      navigate({
        to: "/category/$slug",
        params: { slug: targetSlug },
        search: searchParams,
      });
      return;
    }

    navigate({ to: "/category", search: searchParams });
  };

  const resetFilters = () => {
    navigate({ to: "/category", search: {} });
    setFilterOpen(false);
  };

  const filterPanel = (
    <ProductFilterPanel
      filters={{ ...params, category: "", keyword: "" }}
      categories={categories}
      regions={regions}
      priceBounds={priceBounds}
      totalCount={products.length}
      categoryCounts={categoryCounts}
      ratingCounts={ratingCounts}
      onChange={(updates: Partial<ProductDiscoveryFilters>) => updateSearch(updates)}
      onReset={resetFilters}
      onApply={() => setFilterOpen(false)}
    />
  );

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-semibold text-gray-900 dark:text-gray-100">{t("category.title")}</span>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden space-y-5 xl:block">
          {filterPanel}
          <CategoryPromo />
        </div>

        <div className="min-w-0 space-y-5">
          <header className="space-y-3">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("category.allTitle")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("category.productCount", { count: result.totalItems })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ProductSortSelect value={params.sort} onChange={(sort: ProductSortKey) => updateSearch({ sort })} />
                <ViewToggle active="grid" icon="mdi:view-grid" />
                <ViewToggle active="list" icon="mdi:view-list" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-ocop text-ocop hover:bg-ocop hover:text-white xl:hidden"
                onClick={() => setFilterOpen(true)}
              >
                <Icon icon="mdi:tune-variant" width={16} />
                {t("filter.open")}
              </Button>
              <ActiveFilterChips
                filters={{ ...params, category: "", keyword: "" }}
                categories={categories}
                onRemove={(updates) => updateSearch(updates)}
              />
              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-ocop hover:bg-ocop-light hover:text-ocop-dark dark:hover:bg-green-950/30"
                  onClick={resetFilters}
                >
                  {t("search.resetFilters")}
                </Button>
              )}
            </div>
          </header>

          <ProductResults products={result.items} isLoading={productsQuery.isLoading || categoriesQuery.isLoading} />

          <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-center">
            <ProductPagination
              page={result.page}
              totalPages={result.totalPages}
              onPageChange={(page) => updateSearch({ page })}
            />
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 sm:ml-auto dark:text-gray-400">
              <span>{t("pagination.pageSizeLabel")}</span>
              <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {DEFAULT_PAGE_SIZE}
              </span>
              <span>{t("pagination.perPage")}</span>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[88vw] overflow-y-auto p-4">
          <SheetHeader className="mb-4 pr-8 text-left">
            <SheetTitle>{t("filter.title")}</SheetTitle>
          </SheetHeader>
          {filterPanel}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ViewToggle({ active, icon }: { active: "grid" | "list"; icon: string }) {
  const { t } = useTranslation("storefront");

  return (
    <button
      type="button"
      aria-label={active === "grid" ? t("section.gridView") : t("section.listView")}
      className={
        active === "grid"
          ? "bg-ocop hidden h-10 w-10 items-center justify-center rounded-lg text-white sm:flex"
          : "hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 sm:flex dark:border-gray-800 dark:bg-gray-900"
      }
    >
      <Icon icon={icon} width={20} />
    </button>
  );
}

function CategoryPromo() {
  const { t } = useTranslation("storefront");

  return (
    <aside className="bg-ocop-light relative overflow-hidden rounded-xl p-5 shadow-sm dark:bg-green-950/30">
      <div className="relative z-10 max-w-[150px]">
        <h2 className="text-ocop-dark dark:text-ocop-100 font-bold">{t("category.promo.title")}</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t("category.promo.desc")}</p>
        <Button className="bg-ocop hover:bg-ocop-dark mt-5 h-10 rounded-lg text-white">
          {t("category.promo.cta")}
        </Button>
      </div>
      <Icon icon="mdi:gift-outline" className="text-ocop/30 absolute right-5 bottom-4" width={78} />
    </aside>
  );
}

function getCategoryCounts(products: Product[], categories: Category[]) {
  return Object.fromEntries(
    categories.map((category) => [
      category.slug,
      discoverProducts(
        products,
        normalizeDiscoveryParams({
          category: category.slug,
          pageSize: Math.max(products.length, 1),
        }),
      ).totalItems,
    ]),
  );
}

function getRatingCounts(products: Product[]) {
  return [5, 4, 3, 2, 1].reduce<Record<number, number>>((acc, rating) => {
    acc[rating] = products.filter((product) => Math.round(product.rating) === rating).length;
    return acc;
  }, {});
}
