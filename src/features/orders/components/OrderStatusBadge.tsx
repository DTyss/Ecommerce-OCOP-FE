import { useTranslation } from "react-i18next";
import type { OrderStatus } from "@/features/orders/types/orders";
import { cn } from "@/utils/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusClassName: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  preparing: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  shipping: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
  completed: "bg-ocop-light text-ocop dark:bg-green-950/30 dark:text-green-300",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation("storefront");

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusClassName[status])}>
      {t(`orders.status.${status}`)}
    </span>
  );
}
