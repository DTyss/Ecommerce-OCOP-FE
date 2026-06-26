import { createFileRoute } from "@tanstack/react-router";
import CartPage from "@/features/cart/pages/cart";

export const Route = createFileRoute("/_storefront/cart")({
  component: CartPage,
});
