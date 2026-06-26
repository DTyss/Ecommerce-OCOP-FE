import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartItemRow } from "../../components/CartItemRow";
import { CartSummary } from "../../components/CartSummary";
import { useCartStore } from "@/features/cart/store/cartStore";

export default function CartPage() {
  const { t } = useTranslation("storefront");
  const { items, toggleSelected, selectAll, setQuantity, removeItem, clearSelected } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      toggleSelected: state.toggleSelected,
      selectAll: state.selectAll,
      setQuantity: state.setQuantity,
      removeItem: state.removeItem,
      clearSelected: state.clearSelected,
    })),
  );
  const selectedItems = useMemo(() => items.filter((item) => item.selected), [items]);
  const selectedCount = selectedItems.length;
  const subtotal = selectedItems.reduce((sum, item) => sum + item.snapshot.price * item.quantity, 0);
  const allSelected = items.length > 0 && items.every((item) => item.selected);
  const someSelected = items.some((item) => item.selected);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Icon icon="mdi:cart-off" className="mx-auto text-gray-300" width={72} />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{t("cart.empty")}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t("cart.emptyDesc")}</p>
        <Button asChild className="bg-ocop hover:bg-ocop-dark mt-5 text-white">
          <Link to="/">{t("cart.continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("cart.title")}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("cart.itemCount", { count: items.length })}
          </p>
        </div>
        <Link to="/" className="text-ocop hover:text-ocop-dark text-sm font-semibold">
          {t("cart.continueShopping")}
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(checked) => selectAll(checked === true)}
                aria-label={t("cart.selectAll")}
                className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop data-[state=indeterminate]:border-ocop data-[state=indeterminate]:bg-ocop"
              />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{t("cart.selectAll")}</span>
            </label>
            <Button
              type="button"
              variant="ghostError"
              size="sm"
              disabled={!someSelected}
              onClick={clearSelected}
              className="hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Icon icon="mdi:trash-can-outline" width={17} />
              {t("cart.removeSelected", { count: selectedCount })}
            </Button>
          </div>

          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onToggleSelected={() => toggleSelected(item.productId)}
              onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>

        <CartSummary selectedCount={selectedCount} subtotal={subtotal} onClearSelected={clearSelected} />
      </div>
    </div>
  );
}
