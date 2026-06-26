import { createFileRoute } from "@tanstack/react-router";
import SellerProductsPage from "@/features/seller/pages/seller-products";

export const Route = createFileRoute("/_storefront/seller/products")({
  component: SellerProductsPage,
});
