import { useTranslation } from "react-i18next";
import { CategorySidebar } from "../../components/CategorySidebar";
import { ProductSection } from "@/features/catalog/components/ProductSection";
import { PromoBanners } from "../../components/PromoBanners";
import { RegionScroller } from "../../components/RegionScroller";
import { TopShops } from "@/features/shops/components/TopShops";
import { TrustBar } from "../../components/TrustBar";
import { WhyChooseOcop } from "../../components/WhyChooseOcop";
import { DeferredHomeSection } from "../../components/DeferredHomeSection";
import { FlashSaleSection } from "@/features/marketing/components/FlashSaleSection";
import { VoucherStrip } from "@/features/marketing/components/VoucherStrip";
import { useForYou } from "@/features/marketing/hooks/useMarketing";
import { useBestSellers, useNewProducts } from "@/features/catalog/hooks/useCatalog";

export default function StorefrontHomePage() {
  return (
    <div className="space-y-6">
      <div className="flex gap-5">
        <div className="hidden xl:block">
          <CategorySidebar />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="space-y-5">
            <RegionScroller />
            <TrustBar />
          </div>

          <BestSellerSection />
        </div>
      </div>

      <DeferredHomeSection className="storefront-perf-section">
        <FlashSaleSection />
      </DeferredHomeSection>

      <DeferredHomeSection className="storefront-perf-section" placeholderClassName="min-h-[190px]">
        <VoucherStrip />
      </DeferredHomeSection>

      <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <DeferredHomeSection className="storefront-perf-section" placeholderClassName="min-h-[150px]">
            <PromoBanners />
          </DeferredHomeSection>

          <DeferredHomeSection className="storefront-perf-section" placeholderClassName="min-h-[720px]">
            <NewProductSection />
          </DeferredHomeSection>

          <DeferredHomeSection className="storefront-perf-section" placeholderClassName="min-h-[720px]">
            <ForYouSection />
          </DeferredHomeSection>
        </div>

        <div className="hidden space-y-5 xl:block">
          <DeferredHomeSection className="storefront-perf-section" placeholderClassName="min-h-[420px]">
            <div className="space-y-5">
              <TopShops />
              <WhyChooseOcop />
            </div>
          </DeferredHomeSection>
        </div>
      </div>
    </div>
  );
}

function BestSellerSection() {
  const { t } = useTranslation("storefront");
  const bestSellers = useBestSellers();

  return (
    <ProductSection
      title={t("section.bestSeller")}
      icon="mdi:fire"
      iconClass="text-orange-500"
      products={bestSellers.data}
      maxItems={6}
      isLoading={bestSellers.isLoading}
      showControls
      gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      viewAllSearch={{ sort: "popular" }}
    />
  );
}

function NewProductSection() {
  const { t } = useTranslation("storefront");
  const newProducts = useNewProducts();

  return (
    <ProductSection
      title={t("section.newProduct")}
      icon="mdi:sprout"
      iconClass="text-ocop-800"
      products={newProducts.data}
      maxItems={12}
      isLoading={newProducts.isLoading}
      gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5"
      viewAllSearch={{ sort: "newest" }}
    />
  );
}

function ForYouSection() {
  const { t } = useTranslation("storefront");
  const forYou = useForYou();

  return (
    <ProductSection
      title={t("marketing.recommendation.forYou")}
      icon="mdi:cards-heart-outline"
      iconClass="text-ocop-red"
      products={forYou.data}
      maxItems={12}
      isLoading={forYou.isLoading}
      gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5"
      viewAllSearch={{ sort: "popular" }}
    />
  );
}
