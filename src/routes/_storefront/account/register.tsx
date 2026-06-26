import { createFileRoute } from "@tanstack/react-router";
import StorefrontRegisterPage from "@/features/account/pages/register";

export const Route = createFileRoute("/_storefront/account/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: StorefrontRegisterPage,
});
