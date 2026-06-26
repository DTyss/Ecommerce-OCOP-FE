// Storefront data hooks. Data is public, so query keys are NOT scoped by
// userId/shopId (unlike admin features). All queries are always enabled.
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalogService";

const STALE_TIME = 5 * 60 * 1000; // 5 min
const GC_TIME = 10 * 60 * 1000; // 10 min

export const storefrontKeys = {
  all: ["storefront"] as const,
  products: ["storefront", "products"] as const,
  bestSellers: ["storefront", "products", "best-seller"] as const,
  newProducts: ["storefront", "products", "new"] as const,
  productDetail: (productId: string) => ["storefront", "products", productId] as const,
  relatedProducts: (productId: string) => ["storefront", "products", productId, "related"] as const,
  regions: ["storefront", "regions"] as const,
  categories: ["storefront", "categories"] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: storefrontKeys.products,
    queryFn: catalogService.getProducts,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: storefrontKeys.bestSellers,
    queryFn: catalogService.getBestSellers,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useNewProducts() {
  return useQuery({
    queryKey: storefrontKeys.newProducts,
    queryFn: catalogService.getNewProducts,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useRegions() {
  return useQuery({
    queryKey: storefrontKeys.regions,
    queryFn: catalogService.getRegions,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: storefrontKeys.categories,
    queryFn: catalogService.getCategories,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: storefrontKeys.productDetail(productId),
    queryFn: () => catalogService.getProductById(productId),
    enabled: !!productId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: storefrontKeys.relatedProducts(productId),
    queryFn: () => catalogService.getRelatedProducts(productId),
    enabled: !!productId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
