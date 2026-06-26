import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { ActiveFilterChips } from "@/features/discovery/components/ActiveFilterChips";
import { ProductFilterPanel } from "@/features/discovery/components/ProductFilterPanel";
import { ProductPagination } from "@/features/discovery/components/ProductPagination";
import { ProductResults } from "../../components/ProductResults";
import { ProductSortSelect } from "@/features/discovery/components/ProductSortSelect";
import { useCategories, useProducts } from "@/features/catalog/hooks/useCatalog";
import {
  DEFAULT_PAGE_SIZE,
  discoverProducts,
  getPriceBounds,
  getUniqueRegions,
  hasActiveDiscoveryFilters,
  normalizeDiscoveryParams,
  serializeDiscoveryParams,
} from "@/features/discovery/utils/productDiscovery";
import type { ProductDiscoveryFilters, ProductDiscoveryParams, ProductSortKey } from "@/features/catalog/types/catalog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function ProductListPage() {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const search = useSearch({ from: "/_storefront/product" });
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const [filterOpen, setFilterOpen] = useState(false);

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const params = useMemo(() => normalizeDiscoveryParams({ ...search, pageSize: DEFAULT_PAGE_SIZE }), [search]);
  const result = useMemo(() => discoverProducts(products, params), [params, products]);
  const regions = useMemo(() => getUniqueRegions(products), [products]);
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);
  const hasFilters = hasActiveDiscoveryFilters(params);

  const updateSearch = (updates: Partial<ProductDiscoveryParams>) => {
    const next = normalizeDiscoveryParams({
      ...params,
      ...updates,
      page: updates.page ?? 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });

    navigate({
      to: "/product",
      search: serializeDiscoveryParams(next),
    });
  };

  const resetFilters = () => {
    navigate({ to: "/product", search: {} });
    setFilterOpen(false);
  };

  const filterPanel = (
    <ProductFilterPanel
      filters={params}
      categories={categories}
      regions={regions}
      priceBounds={priceBounds}
      onChange={(updates: Partial<ProductDiscoveryFilters>) => updateSearch(updates)}
      onReset={resetFilters}
    />
  );

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{t("productListing.title")}</span>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("productListing.title")}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("productListing.resultCount", { count: result.totalItems })}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-ocop text-ocop hover:bg-ocop hover:text-white xl:hidden"
          onClick={() => setFilterOpen(true)}
        >
          <Icon icon="mdi:tune-variant" width={18} />
          {t("filter.open")}
        </Button>
      </header>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden xl:block">{filterPanel}</div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
            <ActiveFilterChips filters={params} categories={categories} onRemove={(updates) => updateSearch(updates)} />
            <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
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
              <ProductSortSelect value={params.sort} onChange={(sort: ProductSortKey) => updateSearch({ sort })} />
            </div>
          </div>

          <ProductResults products={result.items} isLoading={productsQuery.isLoading || categoriesQuery.isLoading} />

          <ProductPagination
            page={result.page}
            totalPages={result.totalPages}
            onPageChange={(page) => updateSearch({ page })}
          />
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
