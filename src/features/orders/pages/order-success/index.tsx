import { useTranslation } from "react-i18next";
import { Link, useSearch } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/features/orders/store/orderStore";
import { formatCurrency } from "@/utils/currency";

export default function OrderSuccessPage() {
  const { t } = useTranslation("storefront");
  const { orderId } = useSearch({ from: "/_storefront/order-success" });
  const order = useOrderStore((state) => state.getOrderById(orderId ?? ""));

  if (!orderId || !order) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Icon icon="mdi:clipboard-alert-outline" className="mx-auto text-gray-300" width={72} />
        <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{t("common.notFound")}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t("orderSuccess.invalidDesc")}</p>
        <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
          <Link to="/">{t("common.backHome")}</Link>
        </Button>
      </div>
    );
  }

  const address = [
    order.shippingAddress.addressDetail,
    order.shippingAddress.ward,
    order.shippingAddress.district,
    order.shippingAddress.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <Icon icon="mdi:check-circle" className="text-ocop mx-auto animate-[bounce_0.5s_ease-in-out_1]" width={82} />
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{t("orderSuccess.title")}</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{t("orderSuccess.subtitle")}</p>

      <div className="bg-ocop-light/50 mt-6 rounded-2xl p-4 text-left dark:bg-green-950/20">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">{t("orderSuccess.orderId")}</dt>
            <dd className="font-semibold text-gray-900 dark:text-gray-100">{order.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">{t("common.total")}</dt>
            <dd className="text-ocop font-bold">{formatCurrency(order.total)}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-gray-500 dark:text-gray-400">{t("checkout.address")}</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">
              {order.shippingAddress.fullName} · {order.shippingAddress.phone}
              <br />
              {address}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">{t("orderSuccess.estimatedDelivery")}</dt>
            <dd className="font-semibold text-gray-900 dark:text-gray-100">{order.shippingMethod.estimatedDays}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild className="bg-ocop hover:bg-ocop-dark text-white">
          <Link to="/orders">{t("orderSuccess.viewOrders")}</Link>
        </Button>
        <Button asChild variant="outline" className="border-ocop text-ocop hover:bg-ocop hover:text-white">
          <Link to="/">{t("orderSuccess.continueShopping")}</Link>
        </Button>
      </div>
    </div>
  );
}
