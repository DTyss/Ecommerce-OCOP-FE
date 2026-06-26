import { createFileRoute } from "@tanstack/react-router";
import OcopRegionDetailPage from "@/features/ocop/pages/region-detail";

export const Route = createFileRoute("/_storefront/regions/$regionSlug")({
  component: OcopRegionDetailPage,
});
