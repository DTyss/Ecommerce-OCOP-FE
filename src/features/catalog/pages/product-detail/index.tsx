import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductImageGallery } from "../../components/ProductImageGallery";
import { ProductInfo } from "../../components/ProductInfo";
import { ProductSkeleton } from "../../components/ProductSkeleton";
import { ReviewList } from "../../components/ReviewList";
import { ShopSummaryBlock } from "@/features/shops/components/ShopSummaryBlock";
import { OcopCertificateCard } from "@/features/ocop/components/OcopCertificateCard";
import { TraceabilityCard } from "@/features/ocop/components/TraceabilityCard";
import { useProductDetail } from "@/features/catalog/hooks/useCatalog";
import { BundleOffers } from "@/features/marketing/components/BundleOffers";
import { ProductRecommendations } from "@/features/marketing/components/ProductRecommendations";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useReviewStore } from "@/features/catalog/store/reviewStore";
import { getCategorySlugByName } from "@/features/discovery/utils/productDiscovery";
import { formatCurrency } from "@/utils/currency";

export default function ProductDetailPage() {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/_storefront/product/$productId" });
  const { data: product, isLoading, isError } = useProductDetail(productId);
  const addItem = useCartStore((state) => state.addItem);
  const userReviewsByProduct = useReviewStore((state) => state.userReviews);
  const userReviews = useMemo(() => userReviewsByProduct[productId] ?? [], [productId, userReviewsByProduct]);

  const allReviews = useMemo(() => [...userReviews, ...(product?.reviews ?? [])], [product?.reviews, userReviews]);
  const averageRating = useMemo(
    () =>
      allReviews.length > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
        : (product?.rating ?? 0),
    [allReviews, product?.rating],
  );

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Icon icon="mdi:package-variant-remove" className="text-gray-300" width={72} />
        <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{t("common.notFound")}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("productDetail.notFoundDesc")}</p>
        <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
          <Link to="/">{t("common.backHome")}</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = (quantity: number) => {
    addItem(product, quantity);
  };

  const handleBuyNow = (quantity: number) => {
    addItem(product, quantity);
    navigate({ to: "/checkout" });
  };

  const displayProduct = {
    ...product,
    rating: averageRating,
    reviewCount: allReviews.length,
    reviews: allReviews,
  };
  const trustItems = [
    {
      icon: "mdi:check-decagram-outline",
      title: t("trust.commitment.title"),
      desc: t("productDetail.authenticCommitment", { region: product.region }),
    },
    {
      icon: "mdi:truck-check-outline",
      title: t("trust.return.title"),
      desc: t("productDetail.returnDays", {
        count: product.shippingPolicy.returnDays,
      }),
    },
    {
      icon: "mdi:truck-fast-outline",
      title: t("trust.shipping.title"),
      desc: t("productDetail.freeShipThreshold", {
        amount: formatCurrency(product.shippingPolicy.freeShippingThreshold),
      }),
    },
    {
      icon: "mdi:shield-lock-outline",
      title: t("trust.payment.title"),
      desc: t("trust.payment.desc"),
    },
  ];
  const specItems = [
    {
      icon: "mdi:map-marker-radius-outline",
      label: t("productDetail.origin"),
      value: product.region,
    },
    {
      icon: "mdi:bird",
      label: t("productDetail.productType"),
      value: product.category,
    },
    {
      icon: "mdi:shield-check-outline",
      label: t("productDetail.ingredients"),
      value: t("productDetail.ingredientsValue"),
    },
    {
      icon: "mdi:calendar-clock-outline",
      label: t("productDetail.expiry"),
      value: t("productDetail.expiryValue"),
    },
    {
      icon: "mdi:warehouse",
      label: t("productDetail.storage"),
      value: t("productDetail.storageValue"),
    },
  ];
  const benefits = [
    t("productDetail.benefitProtein"),
    t("productDetail.benefitHealth"),
    t("productDetail.benefitAudience"),
    t("productDetail.benefitOcop"),
  ];

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <Link
          to="/category/$slug"
          params={{ slug: getCategorySlugByName(product.category) }}
          className="hover:text-ocop"
        >
          {product.category}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
      </nav>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]">
        <ProductImageGallery images={product.images} productName={product.name} />
        <div className="space-y-4">
          <ProductInfo product={displayProduct} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          <ShopSummaryBlock shop={product.shop} />
        </div>
      </section>

      <section className="grid gap-3 border-y border-gray-100 py-4 md:grid-cols-2 xl:grid-cols-4 dark:border-gray-800">
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-center gap-3 px-2">
            <span className="bg-ocop-light text-ocop flex h-11 w-11 shrink-0 items-center justify-center rounded-full dark:bg-green-950/30">
              <Icon icon={item.icon} width={22} />
            </span>
            <span>
              <span className="block font-semibold text-gray-900 dark:text-gray-100">{item.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="border-ocop/20 dark:border-ocop/30 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 xl:grid-cols-5 dark:bg-gray-900">
        {specItems.map((item) => (
          <div key={item.label} className="flex gap-3">
            <span className="bg-ocop-light text-ocop flex h-10 w-10 shrink-0 items-center justify-center rounded-full dark:bg-green-950/30">
              <Icon icon={item.icon} width={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</span>
              <span className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{item.value}</span>
            </span>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <OcopCertificateCard certificate={product.ocopCertificate} />
        <TraceabilityCard traceability={product.traceability} />
      </div>

      <BundleOffers productId={product.id} />

      <Tabs defaultValue="description" className="space-y-5">
        <TabsList className="storefront-horizontal-scrollbar flex h-auto w-full justify-start gap-4 overflow-x-auto rounded-none border-b border-gray-100 bg-transparent p-0 dark:border-gray-800 dark:bg-transparent">
          {[
            ["description", t("productDetail.description")],
            ["detail", t("productDetail.detailInfo")],
            ["usage", t("productDetail.usageGuide")],
            ["reviews", t("productDetail.reviewTab", { count: allReviews.length })],
            ["faq", t("productDetail.faqTab", { count: 8 })],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:border-ocop data-[state=active]:text-ocop rounded-none border-b-2 border-transparent bg-transparent px-6 py-4 text-sm font-semibold text-gray-500 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:bg-transparent"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="description" className="mt-0">
          <section className="grid gap-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)] dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t("productDetail.descriptionTitle", { name: product.name })}
                </h2>
                <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <Icon icon="mdi:check-circle" className="text-ocop mt-0.5 shrink-0" width={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <img
              src={product.images[1] ?? product.image}
              alt={product.name}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          </section>
        </TabsContent>

        <TabsContent value="detail" className="mt-0">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {specItems.map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="usage" className="mt-0">
          <section className="rounded-xl border border-gray-100 bg-white p-5 leading-7 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            {t("productDetail.usageGuideDesc", { name: product.name })}
          </section>
        </TabsContent>

        <TabsContent value="reviews" className="mt-0">
          <ReviewList productId={product.id} rating={averageRating} reviews={allReviews} />
        </TabsContent>

        <TabsContent value="faq" className="mt-0">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("productDetail.faqTitle")}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("productDetail.faqDesc")}</p>
          </section>
        </TabsContent>
      </Tabs>

      <ReviewList productId={product.id} rating={averageRating} reviews={allReviews} />

      <ProductRecommendations productId={product.id} />
    </div>
  );
}
