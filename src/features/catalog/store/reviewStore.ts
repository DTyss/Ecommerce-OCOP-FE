import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductReview } from "@/features/catalog/types/catalog";

interface ReviewStore {
  userReviews: Record<string, ProductReview[]>;
  addReview: (productId: string, review: ProductReview) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      userReviews: {},
      addReview: (productId, review) =>
        set((state) => ({
          userReviews: {
            ...state.userReviews,
            [productId]: [review, ...(state.userReviews[productId] ?? [])],
          },
        })),
    }),
    { name: "ocop-reviews" },
  ),
);
