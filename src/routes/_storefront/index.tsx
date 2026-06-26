import { createFileRoute } from "@tanstack/react-router";
import StorefrontHomePage from "@/features/storefront/pages/home";

export const Route = createFileRoute("/_storefront/")({
    component: StorefrontHomePage
});
