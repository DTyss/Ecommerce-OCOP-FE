import { MOCK_PRODUCTS } from "@/features/catalog/mock/data";
import { MOCK_BUNDLES, MOCK_VOUCHERS } from "@/features/marketing/mock/data";
import type {
  BundleOffer,
  FlashSaleCampaign,
  ProductRecommendations,
  Voucher,
} from "@/features/marketing/types/marketing";

const delay = <T>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

const getNextMidnight = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
};

const withoutProduct = (productId: string) => MOCK_PRODUCTS.filter((product) => product.id !== productId);

export const calculateVoucherDiscount = (voucher: Voucher, subtotal: number, shippingFee: number) => {
  if (subtotal < voucher.minSpend) return 0;

  if (voucher.type === "freeShipping") {
    return Math.min(shippingFee, voucher.maxDiscount ?? shippingFee);
  }

  if (voucher.type === "fixed") {
    return Math.min(voucher.value, subtotal);
  }

  const percentageDiscount = Math.round((subtotal * voucher.value) / 100);
  return Math.min(percentageDiscount, voucher.maxDiscount ?? percentageDiscount);
};

export const marketingService = {
  getVouchers: async (): Promise<Voucher[]> => delay(MOCK_VOUCHERS),
  getFlashSale: async (): Promise<FlashSaleCampaign> =>
    delay({
      id: "daily-flash-sale",
      endsAt: getNextMidnight(),
      items: MOCK_PRODUCTS.slice(0, 6).map((product, index) => ({
        product,
        salePrice: Math.round((product.price * (82 - index * 2)) / 100000) * 1000,
        soldPercent: 42 + index * 9,
      })),
    }),
  getBundles: async (productId: string): Promise<BundleOffer[]> =>
    delay(MOCK_BUNDLES.filter((bundle) => bundle.primaryProductId === productId)),
  getForYou: async () =>
    delay([...MOCK_PRODUCTS].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 12)),
  getRecommendations: async (productId: string): Promise<ProductRecommendations> => {
    const current = MOCK_PRODUCTS.find((product) => product.id === productId);

    if (!current) {
      return delay({ similar: [], sameRegion: [], sameShop: [] });
    }

    const candidates = withoutProduct(productId);
    return delay({
      similar: candidates.filter((product) => product.category === current.category).slice(0, 4),
      sameRegion: candidates.filter((product) => product.region === current.region).slice(0, 4),
      sameShop: candidates.filter((product) => product.shopId === current.shopId).slice(0, 4),
    });
  },
};
