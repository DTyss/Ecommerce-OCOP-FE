import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import type { Order } from "@/features/orders/types/orders";
import { formatCurrency } from "@/utils/currency";

interface SellerRecentOrdersProps {
  orders: Order[];
}

export function SellerRecentOrders({ orders }: SellerRecentOrdersProps) {
  const { t } = useTranslation("storefront");

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <Icon icon="mdi:clipboard-text-clock-outline" className="text-ocop" width={22} />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("sellerDashboard.recentOrders")}</h2>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-3 rounded-xl border border-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{order.id}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("cart.itemCount", { count: order.items.length })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <span className="text-ocop font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
