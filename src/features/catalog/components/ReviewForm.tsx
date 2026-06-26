import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingInput } from "./StarRatingInput";
import { useStorefrontAuthStore } from "@/features/account/store/authStore";
import { useReviewStore } from "@/features/catalog/store/reviewStore";
import type { ProductReview } from "@/features/catalog/types/catalog";

interface ReviewFormProps {
  productId: string;
}

const createReviewId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `review-${Date.now()}`;
};

export function ReviewForm({ productId }: ReviewFormProps) {
  const { t } = useTranslation("storefront");
  const user = useStorefrontAuthStore((state) => state.user);
  const addReview = useReviewStore((state) => state.addReview);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (rating === 0) {
      setError(t("review.ratingRequired"));
      return;
    }

    if (comment.trim().length < 10) {
      setError(t("review.commentMinLength"));
      return;
    }

    const review: ProductReview = {
      id: createReviewId(),
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatar,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      images: imageNames,
      verifiedPurchase: false,
    };

    addReview(productId, review);
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border-ocop/30 bg-ocop-light/70 text-ocop mt-5 flex items-center gap-2 rounded-xl border p-4 text-sm font-medium dark:bg-green-950/30">
        <Icon icon="mdi:check-circle" width={18} />
        {t("review.submitSuccess")}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60"
    >
      <h3 className="font-bold text-gray-900 dark:text-gray-100">{t("review.writeReview")}</h3>

      <div className="mt-4 space-y-2">
        <Label>{t("review.yourRating")}</Label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="review-comment">{t("review.yourComment")}</Label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={t("review.commentPlaceholder")}
          className="min-h-28 bg-white dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="review-images">{t("review.addImages")}</Label>
        <input
          id="review-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            const names = Array.from(event.target.files ?? []).map((file) => file.name);
            setImageNames(names);
          }}
          className="file:bg-ocop-light file:text-ocop block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-semibold dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        />
        {imageNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imageNames.map((name) => (
              <span
                key={name}
                className="bg-ocop-light text-ocop rounded-full px-2.5 py-1 text-xs font-medium dark:bg-green-950/30"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-ocop-red mt-3 text-sm">{error}</p>}

      <Button type="submit" className="bg-ocop hover:bg-ocop-dark mt-4 text-white">
        <Icon icon="mdi:send-outline" />
        {t("review.submit")}
      </Button>
    </form>
  );
}
