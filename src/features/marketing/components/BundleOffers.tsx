import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { CartActionButton } from "@/components/common/CartActionButton";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useBundles } from "@/features/marketing/hooks/useMarketing";
import { formatCurrency } from "@/utils/currency";

export function BundleOffers({ productId }: { productId: string }) {
  const { t } = useTranslation("storefront");
  const { data: bundles = [] } = useBundles(productId);
  const addPromotionalItems = useCartStore((state) => state.addPromotionalItems);
  const [addedId, setAddedId] = useState<string | null>(null);

  if (bundles.length === 0) return null;

  return (
    <section className="border-ocop-amber/25 from-ocop-50/60 to-ocop-amber/10 dark:border-ocop-amber/15 dark:to-ocop-amber/5 rounded-2xl border bg-gradient-to-br via-white p-5 dark:from-green-950/20 dark:via-gray-900">
      <div className="flex items-center gap-3">
        <span className="bg-ocop-amber flex h-11 w-11 items-center justify-center rounded-full text-white">
          <Icon icon="mdi:package-variant-closed-plus" width={24} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("marketing.bundle.title")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("marketing.bundle.subtitle")}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {bundles.map((bundle) => {
          const listPrice = bundle.products.reduce((sum, product) => sum + product.price, 0);
          const saving = listPrice - bundle.bundlePrice;

          return (
            <div
              key={bundle.id}
              className="grid gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center dark:border-gray-800 dark:bg-gray-900/80"
            >
              <div className="flex items-center gap-2 overflow-x-auto">
                {bundle.products.map((product, index) => (
                  <div key={product.id} className="flex shrink-0 items-center gap-2">
                    {index > 0 && <Icon icon="mdi:plus" className="text-ocop" width={20} />}
                    <div className="w-28">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <p className="mt-1 line-clamp-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {product.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-400 line-through">{formatCurrency(listPrice)}</p>
                <p className="text-ocop text-2xl font-bold">{formatCurrency(bundle.bundlePrice)}</p>
                <p className="text-ocop-red mt-1 text-sm font-semibold">
                  {t("marketing.bundle.save", { amount: formatCurrency(saving) })}
                </p>
                <CartActionButton
                  type="button"
                  flyImageSrc={bundle.products[0]?.image}
                  onClick={() => {
                    const factor = bundle.bundlePrice / listPrice;
                    let allocated = 0;
                    const entries = bundle.products.map((product, index) => {
                      const isLast = index === bundle.products.length - 1;
                      const unitPrice = isLast
                        ? bundle.bundlePrice - allocated
                        : Math.floor((product.price * factor) / 1000) * 1000;
                      allocated += unitPrice;
                      return {
                        product,
                        unitPrice,
                        promotionType: "bundle" as const,
                      };
                    });
                    addPromotionalItems(entries);
                    setAddedId(bundle.id);
                  }}
                  className="bg-ocop hover:bg-ocop-dark mt-3 w-full text-white"
                >
                  <Icon icon="mdi:cart-plus" width={18} />
                  {addedId === bundle.id ? t("marketing.bundle.added") : t("marketing.bundle.add")}
                </CartActionButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
