import { createFileRoute } from "@tanstack/react-router";
import BecomeSellerPage from "@/features/seller/pages/become-seller";

export const Route = createFileRoute("/_storefront/seller/register")({
  component: BecomeSellerPage,
});
