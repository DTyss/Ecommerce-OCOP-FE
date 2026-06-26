import { useTranslation } from "react-i18next";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { useProductRecommendations } from "@/features/marketing/hooks/useMarketing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductRecommendations({ productId }: { productId: string }) {
  const { t } = useTranslation("storefront");
  const { data, isLoading } = useProductRecommendations(productId);

  const groups = [
    { key: "similar", products: data?.similar ?? [] },
    { key: "sameRegion", products: data?.sameRegion ?? [] },
    { key: "sameShop", products: data?.sameShop ?? [] },
  ] as const;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("marketing.recommendation.title")}</h2>
      <Tabs defaultValue="similar">
        <TabsList className="storefront-horizontal-scrollbar h-auto w-full justify-start overflow-x-auto bg-transparent p-0">
          {groups.map((group) => (
            <TabsTrigger
              key={group.key}
              value={group.key}
              className="data-[state=active]:border-ocop data-[state=active]:bg-ocop rounded-full border border-gray-200 px-4 py-2 data-[state=active]:text-white dark:border-gray-700"
            >
              {t(`marketing.recommendation.${group.key}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {isLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          groups.map((group) => (
            <TabsContent key={group.key} value={group.key} className="mt-4">
              {group.products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-white p-5 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  {t("marketing.recommendation.empty")}
                </p>
              )}
            </TabsContent>
          ))
        )}
      </Tabs>
    </section>
  );
}
