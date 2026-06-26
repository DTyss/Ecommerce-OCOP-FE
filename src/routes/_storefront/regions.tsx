import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import OcopRegionsPage from "@/features/ocop/pages/regions";

export const Route = createFileRoute("/_storefront/regions")({
  component: RegionsRoute,
});

function RegionsRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return pathname === "/regions" ? <OcopRegionsPage /> : <Outlet />;
}
