import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";

interface CartSummaryProps {
  selectedCount: number;
  subtotal: number;
  onClearSelected: () => void;
}

export function CartSummary({ selectedCount, subtotal, onClearSelected }: CartSummaryProps) {
  const { t } = useTranslation("storefront");
  const hasSelection = selectedCount > 0;

  return (
    <aside className="sticky bottom-16 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.10)] xl:static xl:shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>{t("cart.selected", { count: selectedCount })}</span>
          <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{t("common.subtotal")}</span>
          <span className="text-ocop text-xl font-bold">{formatCurrency(subtotal)}</span>
        </div>
        <Button
          type="button"
          variant="outlineError"
          disabled={!hasSelection}
          onClick={onClearSelected}
          className="h-10 w-full border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:bg-gray-900 dark:hover:bg-red-950/20"
        >
          <Icon icon="mdi:trash-can-outline" width={18} />
          {t("cart.removeSelected", { count: selectedCount })}
        </Button>
        {hasSelection ? (
          <Button asChild className="bg-ocop hover:bg-ocop-dark h-11 w-full text-white">
            <Link to="/checkout">
              <Icon icon="mdi:credit-card-check-outline" width={18} />
              {t("cart.proceedToCheckout")}
            </Link>
          </Button>
        ) : (
          <Button type="button" disabled className="bg-ocop hover:bg-ocop-dark h-11 w-full text-white">
            <Icon icon="mdi:credit-card-check-outline" width={18} />
            {t("cart.proceedToCheckout")}
          </Button>
        )}
      </div>
    </aside>
  );
}
