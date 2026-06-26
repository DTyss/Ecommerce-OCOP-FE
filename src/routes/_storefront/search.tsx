import { createFileRoute } from "@tanstack/react-router";
import SearchPage from "@/features/discovery/pages/search";

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

export const Route = createFileRoute("/_storefront/search")({
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
  component: SearchPage,
});
