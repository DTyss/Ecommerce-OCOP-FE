import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_PRODUCTS } from "@/features/catalog/mock/data";
import type { Product } from "@/features/catalog/types/catalog";
import type { CartItem } from "@/features/cart/types/cart";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  addPromotionalItems: (
    entries: Array<{
      product: Product;
      quantity?: number;
      unitPrice: number;
      promotionType: "bundle" | "flashSale";
    }>,
  ) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  toggleSelected: (productId: string) => void;
  selectAll: (selected: boolean) => void;
  clearSelected: () => void;
  getSelectedItems: () => CartItem[];
  getTotalSelected: () => number;
  getItemCount: () => number;
  clear: () => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const normalizeCartItem = (value: unknown): CartItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  const productId =
    typeof value.productId === "string" ? value.productId : typeof value.id === "string" ? value.id : null;

  if (!productId) {
    return null;
  }

  const product = MOCK_PRODUCTS.find((item) => item.id === productId);
  const snapshotValue = isRecord(value.snapshot) ? value.snapshot : value;
  const name = typeof snapshotValue.name === "string" ? snapshotValue.name : product?.name;
  const image = typeof snapshotValue.image === "string" ? snapshotValue.image : product?.image;
  const price = typeof snapshotValue.price === "number" ? snapshotValue.price : product?.price;
  const originalPrice =
    typeof snapshotValue.originalPrice === "number" ? snapshotValue.originalPrice : (product?.originalPrice ?? null);

  if (!name || !image || typeof price !== "number") {
    return null;
  }

  return {
    productId,
    quantity: typeof value.quantity === "number" && value.quantity > 0 ? Math.floor(value.quantity) : 1,
    selected: typeof value.selected === "boolean" ? value.selected : true,
    promotionType: value.promotionType === "bundle" || value.promotionType === "flashSale" ? value.promotionType : null,
    snapshot: {
      name,
      image,
      price,
      originalPrice,
    },
  };
};

const normalizeCartItems = (items: unknown): CartItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => normalizeCartItem(item)).filter((item): item is CartItem => item !== null);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const safeQuantity = Math.max(1, Math.min(quantity, product.stock));
          const existing = state.items.find((i) => i.productId === product.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + safeQuantity, product.stock),
                      selected: true,
                    }
                  : i,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity: safeQuantity,
                selected: true,
                promotionType: null,
                snapshot: {
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  originalPrice: product.originalPrice,
                },
              },
            ],
          };
        }),
      addPromotionalItems: (entries) =>
        set((state) => ({
          items: entries.reduce<CartItem[]>((items, entry) => {
            const quantity = Math.max(1, Math.min(entry.quantity ?? 1, entry.product.stock));
            const existing = items.find((item) => item.productId === entry.product.id);

            if (existing) {
              return items.map((item) =>
                item.productId === entry.product.id
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, entry.product.stock),
                      selected: true,
                      promotionType: entry.promotionType,
                      snapshot: {
                        ...item.snapshot,
                        price: Math.min(item.snapshot.price, entry.unitPrice),
                        originalPrice: entry.product.price,
                      },
                    }
                  : item,
              );
            }

            return [
              ...items,
              {
                productId: entry.product.id,
                quantity,
                selected: true,
                promotionType: entry.promotionType,
                snapshot: {
                  name: entry.product.name,
                  image: entry.product.image,
                  price: entry.unitPrice,
                  originalPrice: entry.product.price,
                },
              },
            ];
          }, state.items),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        })),
      toggleSelected: (productId) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, selected: !i.selected } : i)),
        })),
      selectAll: (selected) =>
        set((state) => ({
          items: state.items.map((i) => ({ ...i, selected })),
        })),
      clearSelected: () =>
        set((state) => ({
          items: state.items.filter((i) => !i.selected),
        })),
      getSelectedItems: () => get().items.filter((item) => item.selected),
      getTotalSelected: () =>
        get()
          .items.filter((item) => item.selected)
          .reduce((sum, item) => sum + item.snapshot.price * item.quantity, 0),
      getItemCount: () => get().items.length,
      clear: () => set({ items: [] }),
    }),
    {
      name: "ocop-cart",
      merge: (persistedState, currentState) => {
        const persistedItems = isRecord(persistedState) && "items" in persistedState ? persistedState.items : [];

        const safePersistedState = isRecord(persistedState) ? persistedState : {};

        return {
          ...currentState,
          ...safePersistedState,
          items: normalizeCartItems(persistedItems),
        } as CartState;
      },
    },
  ),
);

export const useCartCount = () => useCartStore((state) => state.items.length);
