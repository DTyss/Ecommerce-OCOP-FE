import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import ShopListPage from "@/features/shops/pages/shop-list";

export const Route = createFileRoute("/_storefront/shop")({
  component: ShopRoute,
});

function ShopRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return pathname === "/shop" ? <ShopListPage /> : <Outlet />;
}
