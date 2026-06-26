import { createFileRoute } from "@tanstack/react-router";
import OcopMapPage from "@/features/ocop/pages/map";

export const Route = createFileRoute("/_storefront/ocop-map")({
  validateSearch: (search: Record<string, unknown>) => ({
    region: typeof search.region === "string" ? search.region : undefined,
  }),
  component: OcopMapPage,
});
