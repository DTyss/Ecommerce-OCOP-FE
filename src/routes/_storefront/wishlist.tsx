import { createFileRoute } from "@tanstack/react-router";
import WishlistPage from "@/features/wishlist/pages/wishlist";

export const Route = createFileRoute("/_storefront/wishlist")({
  component: WishlistPage,
});
