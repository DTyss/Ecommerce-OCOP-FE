import { createFileRoute } from "@tanstack/react-router";
import StorefrontProfilePage from "@/features/account/pages/profile";

export const Route = createFileRoute("/_storefront/profile")({
  component: StorefrontProfilePage,
});
