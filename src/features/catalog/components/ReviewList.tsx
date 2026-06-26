import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./ReviewForm";
import { useStorefrontAuthStore } from "@/features/account/store/authStore";
import type { ProductReview } from "@/features/catalog/types/catalog";
import { cn } from "@/utils/utils";

interface ReviewListProps {
  productId: string;
  rating: number;
  reviews: ProductReview[];
}

type ReviewFilter = "all" | "photo" | 5 | 4 | 3 | 2 | 1;

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Icon
          key={index}
          icon={index + 1 <= Math.round(rating) ? "mdi:star" : "mdi:star-outline"}
          className="text-ocop-amber"
          width={16}
        />
      ))}
    </span>
  );
}

export function ReviewList({ productId, rating, reviews }: ReviewListProps) {
  const { t } = useTranslation("storefront");
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");
  const user = useStorefrontAuthStore((state) => state.user);
  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((review) => review.rating === star).length;
        return {
          star,
          count,
          percent: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
        };
      }),
    [reviews],
  );
  const photoReviews = useMemo(() => reviews.filter((review) => review.images.length > 0), [reviews]);
  const customerImages = photoReviews.flatMap((review) => review.images).slice(0, 4);
  const filteredReviews = useMemo(() => {
    const filtered =
      selectedFilter === "all"
        ? reviews
        : selectedFilter === "photo"
          ? photoReviews
          : reviews.filter((review) => review.rating === selectedFilter);

    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [photoReviews, reviews, selectedFilter]);
  const filters: Array<{ label: string; value: ReviewFilter }> = [
    {
      label: t("productDetail.reviewFilterAll", { count: reviews.length }),
      value: "all",
    },
    ...distribution.map((item) => ({
      label: t("productDetail.reviewFilterStar", {
        star: item.star,
        count: item.count,
      }),
      value: item.star as ReviewFilter,
    })),
    {
      label: t("productDetail.reviewFilterPhoto", {
        count: photoReviews.length,
      }),
      value: "photo",
    },
  ];

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("productDetail.reviews")}</h2>

      <div className="mt-5 grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)_260px]">
        <div className="text-center">
          <p className="text-ocop text-4xl font-bold">
            {rating.toFixed(1)}
            <span className="ml-1 text-base font-semibold text-gray-500 dark:text-gray-400">/5</span>
          </p>
          <Stars rating={rating} className="mt-2 justify-center" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("productDetail.reviewCount", { count: reviews.length })}
          </p>
        </div>

        <div className="space-y-2">
          {distribution.map((item) => (
            <div key={item.star} className="flex items-center gap-3 text-sm">
              <span className="flex w-10 items-center gap-1 text-gray-600 dark:text-gray-300">
                {item.star}
                <Icon icon="mdi:star" className="text-ocop-amber" width={14} />
              </span>
              <div className="grid flex-1 grid-cols-10 gap-0.5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-2 rounded-full",
                      index < Math.round(item.percent / 10) ? "bg-ocop-amber" : "bg-gray-100 dark:bg-gray-800",
                    )}
                  />
                ))}
              </div>
              <span className="w-8 text-right text-gray-500 dark:text-gray-400">{item.count}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{t("productDetail.customerImages")}</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {customerImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={t("productDetail.reviewImageAlt")}
                className="aspect-square rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        {filters.map((filter) => (
          <button
            key={String(filter.value)}
            type="button"
            onClick={() => setSelectedFilter(filter.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              selectedFilter === filter.value
                ? "border-ocop bg-ocop-light text-ocop dark:bg-green-950/30"
                : "hover:border-ocop/40 hover:text-ocop border-gray-200 bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
            )}
          >
            {filter.label}
          </button>
        ))}
        <Button
          type="button"
          variant="outline"
          className="hover:border-ocop hover:bg-ocop-light hover:text-ocop ml-auto h-9 rounded-full border-gray-200 px-4 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-green-950/30"
        >
          {t("productDetail.sortNewest")}
          <Icon icon="mdi:chevron-down" width={14} />
        </Button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {filteredReviews.map((review) => (
          <article key={review.id} className="border-t border-gray-100 pt-4 lg:border-t-0 lg:pt-0 dark:border-gray-800">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                {review.userAvatar && <AvatarImage src={review.userAvatar} alt={review.userName} />}
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{review.userName}</h3>
                  {review.verifiedPurchase && (
                    <span className="bg-ocop-light text-ocop rounded-full px-2 py-0.5 text-xs font-semibold dark:bg-green-950/30">
                      {t("productDetail.verifiedPurchase")}
                    </span>
                  )}
                </div>
                <Stars rating={review.rating} className="mt-1" />
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={`${review.id}-${image}-${index}`}
                        src={image}
                        alt={t("productDetail.reviewImageAlt")}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {reviews.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="border-ocop text-ocop hover:bg-ocop rounded-lg px-8 hover:text-white"
          >
            {t("productDetail.viewAllReviews", { count: reviews.length })}
          </Button>
        </div>
      )}

      {user ? (
        <ReviewForm productId={productId} />
      ) : (
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-center text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
          <Link
            to="/account/login"
            search={{ redirect: `/product/${productId}` }}
            className="text-ocop hover:text-ocop-dark font-semibold"
          >
            {t("auth.login")}
          </Link>{" "}
          {t("review.loginToReview")}
        </div>
      )}
    </section>
  );
}
