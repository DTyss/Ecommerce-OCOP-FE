import {
  getBestSellers,
  getNewProducts,
  getOcopMetadata,
  MOCK_PRODUCTS,
  MOCK_PRODUCT_DETAILS,
  MOCK_PRODUCT_SHOP_SUMMARIES,
  MOCK_REVIEWS,
  mockCategories,
  mockRegions,
} from "../mock/data";
import type { Category, Product, ProductDetail, Region } from "@/features/catalog/types/catalog";

const delay = <T>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

const defaultShippingPolicy = {
  freeShippingThreshold: 299000,
  estimatedDays: "2-3 ngày",
  returnDays: 7,
  provider: "GHTK",
};

const createProductDetail = (
  product: Product,
  relatedProductIds: string[],
  shippingPolicy = defaultShippingPolicy,
): ProductDetail | null => {
  const shop = MOCK_PRODUCT_SHOP_SUMMARIES.find((item) => item.id === product.shopId);

  if (!shop) {
    return null;
  }

  return {
    ...product,
    ...getOcopMetadata(product),
    shop,
    reviews: MOCK_REVIEWS,
    shippingPolicy,
    relatedProductIds,
  };
};

const createProductDetailFallback = (product: Product): ProductDetail | null =>
  createProductDetail(
    product,
    MOCK_PRODUCTS.filter((item) => item.id !== product.id)
      .filter((item) => item.tags.some((tag) => product.tags.includes(tag)))
      .map((item) => item.id)
      .slice(0, 4),
  );

export const catalogService = {
  getProducts: async (): Promise<Product[]> => delay(MOCK_PRODUCTS),
  getBestSellers: async (): Promise<Product[]> => delay(getBestSellers()),
  getNewProducts: async (): Promise<Product[]> => delay(getNewProducts()),
  getRegions: async (): Promise<Region[]> => delay(mockRegions),
  getCategories: async (): Promise<Category[]> => delay(mockCategories),
  getProductById: async (id: string): Promise<ProductDetail | null> => {
    const detail = MOCK_PRODUCT_DETAILS[id];

    if (detail) {
      return delay(detail);
    }

    const product = MOCK_PRODUCTS.find((item) => item.id === id);

    if (!product) {
      return delay(null);
    }

    return delay(createProductDetailFallback(product));
  },
  getRelatedProducts: async (productId: string, limit = 4): Promise<Product[]> => {
    const product = MOCK_PRODUCTS.find((item) => item.id === productId);

    if (!product) {
      return delay([]);
    }

    const detailIds = MOCK_PRODUCT_DETAILS[productId]?.relatedProductIds ?? [];
    const seeded = detailIds
      .map((id) => MOCK_PRODUCTS.find((item) => item.id === id))
      .filter((item): item is Product => Boolean(item));
    const fallback = MOCK_PRODUCTS.filter((item) => item.id !== productId)
      .filter((item) => !detailIds.includes(item.id))
      .filter((item) => item.tags.some((tag) => product.tags.includes(tag)))
      .slice(0, limit - seeded.length);
    const related = [...seeded, ...fallback].slice(0, limit);

    return delay(related);
  },
};
