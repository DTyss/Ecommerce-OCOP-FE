import { MOCK_PRODUCTS } from "@/features/catalog/mock/data";
import type { Product } from "@/features/catalog/types/catalog";
import { MOCK_SHOPS, mockTopShops } from "@/features/shops/mock/data";
import type { ShopSummary } from "@/features/shops/types/shops";

const delay = <T>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const shopsService = {
  getShops: async (): Promise<ShopSummary[]> => delay(MOCK_SHOPS),
  getTopShops: async (): Promise<ShopSummary[]> => delay(mockTopShops),
  getShopById: async (id: string): Promise<ShopSummary | null> =>
    delay(MOCK_SHOPS.find((shop) => shop.id === id) ?? null),
  getShopProducts: async (shopId: string): Promise<Product[]> =>
    delay(MOCK_PRODUCTS.filter((product) => product.shopId === shopId)),
};
