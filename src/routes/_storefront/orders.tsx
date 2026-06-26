import { createFileRoute } from "@tanstack/react-router";
import OrdersPage from "@/features/orders/pages/orders";

export const Route = createFileRoute("/_storefront/orders")({
  component: OrdersPage,
});
