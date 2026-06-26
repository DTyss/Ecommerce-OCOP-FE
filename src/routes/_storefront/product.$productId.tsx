import { createFileRoute } from "@tanstack/react-router";
import ProductDetailPage from "@/features/catalog/pages/product-detail";

export const Route = createFileRoute("/_storefront/product/$productId")({
  component: ProductDetailPage,
});
