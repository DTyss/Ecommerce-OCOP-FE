import { createFileRoute } from "@tanstack/react-router";
import CheckoutPage from "@/features/checkout/pages/checkout";

export const Route = createFileRoute("/_storefront/checkout")({
  component: CheckoutPage,
});
