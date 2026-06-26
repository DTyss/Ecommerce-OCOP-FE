import { useQuery } from "@tanstack/react-query";
import { MOCK_PAYMENT_OPTIONS, MOCK_SHIPPING_OPTIONS } from "@/features/checkout/mock/data";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;
const delay = <T>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const checkoutOptionKeys = {
  shippingOptions: ["storefront", "shipping-options"] as const,
  paymentOptions: ["storefront", "payment-options"] as const,
};

export function useShippingOptions() {
  return useQuery({
    queryKey: checkoutOptionKeys.shippingOptions,
    queryFn: () => delay(MOCK_SHIPPING_OPTIONS),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function usePaymentOptions() {
  return useQuery({
    queryKey: checkoutOptionKeys.paymentOptions,
    queryFn: () => delay(MOCK_PAYMENT_OPTIONS),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
