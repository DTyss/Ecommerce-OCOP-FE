import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantitySelector } from "@/features/catalog/components/QuantitySelector";
import type { CartItem } from "@/features/cart/types/cart";
import { formatCurrency } from "@/utils/currency";

interface CartItemRowProps {
  item: CartItem;
  onToggleSelected: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onToggleSelected, onQuantityChange, onRemove }: CartItemRowProps) {
  const { t } = useTranslation("storefront");
  const subtotal = item.snapshot.price * item.quantity;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="grid gap-3 sm:grid-cols-[auto_88px_1fr_auto_auto_auto] sm:items-center">
        <div className="flex items-start gap-3 sm:contents">
          <Checkbox
            checked={item.selected}
            onCheckedChange={onToggleSelected}
            aria-label={t("cart.selectItem")}
            className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop mt-8 sm:mt-0"
          />
          <img src={item.snapshot.image} alt={item.snapshot.name} className="h-20 w-20 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            {item.promotionType && (
              <span className="bg-ocop-amber/15 text-ocop-amber mb-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                {t(`marketing.promotion.${item.promotionType}`)}
              </span>
            )}
            <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {item.snapshot.name}
            </h2>
            <p className="text-ocop mt-1 font-bold">{formatCurrency(item.snapshot.price)}</p>
            {item.snapshot.originalPrice && (
              <p className="text-xs text-gray-400 line-through">{formatCurrency(item.snapshot.originalPrice)}</p>
            )}
          </div>
        </div>

        <div className="ml-8 flex flex-wrap items-center justify-between gap-3 sm:ml-0 sm:contents">
          <QuantitySelector value={item.quantity} max={99} onChange={onQuantityChange} />
          <p className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(subtotal)}</p>
          <button
            type="button"
            onClick={onRemove}
            className="hover:text-ocop-red flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
            aria-label={t("cart.remove")}
          >
            <Icon icon="mdi:trash-can-outline" width={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
