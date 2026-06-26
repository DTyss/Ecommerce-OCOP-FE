import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { SellerDashboardStats } from "../../components/SellerDashboardStats";
import { SellerNav } from "../../components/SellerNav";
import { SellerRecentOrders } from "../../components/SellerRecentOrders";
import { useOrderStore } from "@/features/orders/store/orderStore";
import { useSellerStore } from "@/features/seller/store/sellerStore";
import type { SellerDashboardMetric } from "@/features/seller/types/seller";
import { formatCurrency } from "@/utils/currency";

export default function SellerDashboardPage() {
  const { t } = useTranslation("storefront");
  const registration = useSellerStore((state) => state.registration);
  const products = useSellerStore((state) => state.products);
  const orders = useOrderStore((state) => state.orders);

  const metrics = useMemo<SellerDashboardMetric[]>(() => {
    const revenue = products.reduce((sum, product) => sum + product.price * product.soldCount, 0);
    const activeProducts = products.filter((product) => product.status === "active").length;
    const pendingProducts = products.filter((product) => product.status === "pending").length;

    return [
      {
        id: "revenue",
        labelKey: "sellerMetric.revenue",
        value: formatCurrency(revenue),
        icon: "mdi:cash-multiple",
        tone: "green",
      },
      {
        id: "orders",
        labelKey: "sellerMetric.orders",
        value: String(orders.length),
        icon: "mdi:clipboard-text-outline",
        tone: "blue",
      },
      {
        id: "active",
        labelKey: "sellerMetric.activeProducts",
        value: String(activeProducts),
        icon: "mdi:package-check",
        tone: "amber",
      },
      {
        id: "pending",
        labelKey: "sellerMetric.pendingProducts",
        value: String(pendingProducts),
        icon: "mdi:clock-outline",
        tone: "red",
      },
    ];
  }, [orders.length, products]);

  const recentOrders = useMemo(() => orders.slice(0, 4), [orders]);

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{t("sellerCenter.dashboard")}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SellerNav />

        <div className="min-w-0 space-y-5">
          <header className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-ocop text-sm font-semibold uppercase">{t("sellerCenter.title")}</p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {registration?.shopName ?? t("sellerDashboard.demoShop")}
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {registration ? t("sellerDashboard.registeredDesc") : t("sellerDashboard.demoDesc")}
                </p>
              </div>
              {!registration && (
                <Button asChild className="bg-ocop hover:bg-ocop-dark text-white">
                  <Link to="/seller/register">{t("sellerCenter.registerTitle")}</Link>
                </Button>
              )}
            </div>
          </header>

          <SellerDashboardStats metrics={metrics} />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <SellerRecentOrders orders={recentOrders} />
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("sellerDashboard.productSummary")}
              </h2>
              <div className="mt-4 space-y-3">
                {(["active", "outOfStock", "pending"] as const).map((status) => {
                  const count = products.filter((product) => product.status === status).length;
                  return (
                    <div key={status}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{t(`sellerProduct.${status}`)}</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{count}</span>
                      </div>
                      <div className="flex gap-1">
                        {products.map((product) => (
                          <span
                            key={product.id}
                            className={
                              product.status === status
                                ? "bg-ocop h-2 flex-1 rounded-full"
                                : "h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 w-full text-white">
                <Link to="/seller/products">{t("sellerCenter.manageProducts")}</Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
