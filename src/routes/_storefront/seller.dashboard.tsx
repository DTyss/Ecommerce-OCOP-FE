import { createFileRoute } from "@tanstack/react-router";
import SellerDashboardPage from "@/features/seller/pages/seller-dashboard";

export const Route = createFileRoute("/_storefront/seller/dashboard")({
  component: SellerDashboardPage,
});
