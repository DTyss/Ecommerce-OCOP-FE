import { useQuery } from "@tanstack/react-query";
import { shopsService } from "@/features/shops/services/shopsService";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export const shopKeys = {
  shops: ["storefront", "shops"] as const,
  topShops: ["storefront", "shops", "top"] as const,
  shopDetail: (shopId: string) => ["storefront", "shops", shopId] as const,
  shopProducts: (shopId: string) => ["storefront", "shops", shopId, "products"] as const,
};

export function useTopShops() {
  return useQuery({
    queryKey: shopKeys.topShops,
    queryFn: shopsService.getTopShops,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useShops() {
  return useQuery({
    queryKey: shopKeys.shops,
    queryFn: shopsService.getShops,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useShopDetail(shopId: string) {
  return useQuery({
    queryKey: shopKeys.shopDetail(shopId),
    queryFn: () => shopsService.getShopById(shopId),
    enabled: !!shopId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useShopProducts(shopId: string) {
  return useQuery({
    queryKey: shopKeys.shopProducts(shopId),
    queryFn: () => shopsService.getShopProducts(shopId),
    enabled: !!shopId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
