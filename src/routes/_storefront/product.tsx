import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import ProductListPage from "@/features/catalog/pages/product-list";

const searchNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

export const Route = createFileRoute("/_storefront/product")({
  validateSearch: (search: Record<string, unknown>) => ({
    keyword: typeof search.keyword === "string" ? search.keyword : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    region: typeof search.region === "string" ? search.region : undefined,
    ocopStar: searchNumber(search.ocopStar),
    minPrice: searchNumber(search.minPrice),
    maxPrice: searchNumber(search.maxPrice),
    rating: searchNumber(search.rating),
    sort: typeof search.sort === "string" ? search.sort : undefined,
    page: searchNumber(search.page),
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return pathname === "/product" ? <ProductListPage /> : <Outlet />;
}
