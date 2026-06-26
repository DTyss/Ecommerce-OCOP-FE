import { createFileRoute } from "@tanstack/react-router";
import StorefrontLoginPage from "@/features/account/pages/login";

export const Route = createFileRoute("/_storefront/account/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: StorefrontLoginPage,
});
