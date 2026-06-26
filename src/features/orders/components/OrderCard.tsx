import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "@/features/orders/types/orders";
import { formatCurrency } from "@/utils/currency";

interface OrderCardProps {
  order: Order;
}

const MAX_PREVIEW_ITEMS = 2;

export function OrderCard({ order }: OrderCardProps) {
  const { t } = useTranslation("storefront");
  const [expanded, setExpanded] = useState(false);
  const previewItems = order.items.slice(0, MAX_PREVIEW_ITEMS);
  const remainingCount = order.items.length - MAX_PREVIEW_ITEMS;
  const address = [
    order.shippingAddress.addressDetail,
    order.shippingAddress.ward,
    order.shippingAddress.district,
    order.shippingAddress.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100">{order.id}</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("orders.orderedAt")}: {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-3 space-y-3">
        {previewItems.map((item) => (
          <div key={`${order.id}-${item.productId}`} className="flex items-center gap-3">
            <img src={item.snapshot.image} alt={item.snapshot.name} className="h-14 w-14 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.snapshot.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">x{item.quantity}</p>
            </div>
            <p className="text-ocop text-sm font-semibold">{formatCurrency(item.snapshot.price)}</p>
          </div>
        ))}
        {remainingCount > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("orders.remainingProducts", { count: remainingCount })}
          </p>
        )}
      </div>

      {expanded && (
        <div className="bg-ocop-light/40 mt-4 space-y-3 rounded-xl p-3 text-sm dark:bg-green-950/20">
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{t("checkout.recipientInfo")}</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              {order.shippingAddress.fullName} · {order.shippingAddress.phone}
            </p>
            <p className="text-gray-600 dark:text-gray-300">{address}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="text-gray-600 dark:text-gray-300">
              {t("checkout.shippingMethod")}: {order.shippingMethod.label}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {t("checkout.paymentMethod")}: {t(`checkout.payment.${order.paymentMethod}`)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {t("common.total")}: <span className="text-ocop text-lg font-bold">{formatCurrency(order.total)}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setExpanded((value) => !value)}
          className="border-ocop text-ocop hover:bg-ocop hover:text-white"
        >
          <Icon icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} width={18} />
          {t("orders.viewDetail")}
        </Button>
      </div>
    </article>
  );
}
