import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_PRODUCTS } from "@/features/catalog/mock/data";
import type { SellerProduct, SellerProductStatus, SellerRegistrationDraft } from "@/features/seller/types/seller";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `seller-product-${Date.now()}`;
};

const seedSellerProducts = (): SellerProduct[] =>
  MOCK_PRODUCTS.slice(0, 5).map((product, index) => ({
    id: `seller-${product.id}`,
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: product.category,
    ocopStar: product.ocopStar,
    status: index === 1 ? "pending" : product.stock > 60 ? "active" : "outOfStock",
    image: product.image,
    soldCount: product.soldCount,
    updatedAt: new Date().toISOString(),
  }));

interface SellerStoreState {
  registration: SellerRegistrationDraft | null;
  products: SellerProduct[];
  submitRegistration: (draft: SellerRegistrationDraft) => void;
  addProduct: (product: Omit<SellerProduct, "id" | "updatedAt">) => void;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => void;
  removeProduct: (id: string) => void;
  setProductStatus: (id: string, status: SellerProductStatus) => void;
}

export const useSellerStore = create<SellerStoreState>()(
  persist(
    (set) => ({
      registration: null,
      products: seedSellerProducts(),
      submitRegistration: (draft) => set({ registration: draft }),
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              ...product,
              id: createId(),
              updatedAt: new Date().toISOString(),
            },
            ...state.products,
          ],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product,
          ),
        })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      setProductStatus: (id, status) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, status, updatedAt: new Date().toISOString() } : product,
          ),
        })),
    }),
    { name: "ocop-seller" },
  ),
);
