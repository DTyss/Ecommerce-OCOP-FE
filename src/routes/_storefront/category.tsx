import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import CategoryListPage from "@/features/discovery/pages/category-list";

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

export const Route = createFileRoute("/_storefront/category")({
  validateSearch: (search: Record<string, unknown>) => ({
    region: typeof search.region === "string" ? search.region : undefined,
    ocopStar: searchNumber(search.ocopStar),
    minPrice: searchNumber(search.minPrice),
    maxPrice: searchNumber(search.maxPrice),
    rating: searchNumber(search.rating),
    sort: typeof search.sort === "string" ? search.sort : undefined,
    page: searchNumber(search.page),
  }),
  component: CategoryRoute,
});

function CategoryRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return pathname === "/category" ? <CategoryListPage /> : <Outlet />;
}
