import { createFileRoute } from "@tanstack/react-router";
import OrderSuccessPage from "@/features/orders/pages/order-success";

export const Route = createFileRoute("/_storefront/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === "string" ? search.orderId : undefined,
  }),
  component: OrderSuccessPage,
});
