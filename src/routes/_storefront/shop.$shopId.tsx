import { createFileRoute } from "@tanstack/react-router";
import ShopDetailPage from "@/features/shops/pages/shop-detail";

export const Route = createFileRoute("/_storefront/shop/$shopId")({
  component: ShopDetailPage,
});
