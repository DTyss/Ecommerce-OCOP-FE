import { useQuery } from "@tanstack/react-query";
import { marketingService } from "@/features/marketing/services/marketingService";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

const marketingKeys = {
  vouchers: ["storefront", "marketing", "vouchers"] as const,
  flashSale: ["storefront", "marketing", "flash-sale"] as const,
  bundles: (productId: string) => ["storefront", "marketing", "bundles", productId] as const,
  forYou: ["storefront", "marketing", "for-you"] as const,
  recommendations: (productId: string) => ["storefront", "marketing", "recommendations", productId] as const,
};

const queryDefaults = { staleTime: STALE_TIME, gcTime: GC_TIME };

export function useVouchers() {
  return useQuery({
    queryKey: marketingKeys.vouchers,
    queryFn: marketingService.getVouchers,
    ...queryDefaults,
  });
}

export function useFlashSale() {
  return useQuery({
    queryKey: marketingKeys.flashSale,
    queryFn: marketingService.getFlashSale,
    ...queryDefaults,
  });
}

export function useBundles(productId: string) {
  return useQuery({
    queryKey: marketingKeys.bundles(productId),
    queryFn: () => marketingService.getBundles(productId),
    enabled: !!productId,
    ...queryDefaults,
  });
}

export function useForYou() {
  return useQuery({
    queryKey: marketingKeys.forYou,
    queryFn: marketingService.getForYou,
    ...queryDefaults,
  });
}

export function useProductRecommendations(productId: string) {
  return useQuery({
    queryKey: marketingKeys.recommendations(productId),
    queryFn: () => marketingService.getRecommendations(productId),
    enabled: !!productId,
    ...queryDefaults,
  });
}
