import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "../../components/OrderCard";
import { useOrderStore } from "@/features/orders/store/orderStore";
import type { OrderStatus } from "@/features/orders/types/orders";
import { cn } from "@/utils/utils";

type OrderTab = OrderStatus | "all";

const tabs: OrderTab[] = ["all", "pending", "confirmed", "preparing", "shipping", "completed", "cancelled"];

export default function OrdersPage() {
  const { t } = useTranslation("storefront");
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const orders = useOrderStore((state) => state.orders);
  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders],
  );
  const countByStatus = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] ?? 0) + 1;
          return acc;
        },
        {} as Partial<Record<OrderStatus, number>>,
      ),
    [orders],
  );
  const filteredOrders =
    activeTab === "all" ? sortedOrders : sortedOrders.filter((order) => order.status === activeTab);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("orders.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("orders.subtitle")}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const count = tab === "all" ? orders.length : (countByStatus[tab] ?? 0);
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "border-ocop bg-ocop text-white"
                  : "hover:border-ocop/40 hover:text-ocop border-gray-100 bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
              )}
            >
              {t(`orders.tabs.${tab}`)}
              {count > 0 && <span className="ml-1">({count})</span>}
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Icon icon="mdi:clipboard-text-off-outline" className="mx-auto text-gray-300" width={72} />
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            {activeTab === "all" ? t("orders.empty") : t("orders.emptyInTab")}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {activeTab === "all" ? t("orders.emptyDesc") : t("orders.emptyInTabDesc")}
          </p>
          {activeTab === "all" && (
            <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
              <Link to="/">{t("cart.continueShopping")}</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
