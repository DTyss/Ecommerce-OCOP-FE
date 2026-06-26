import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutForm } from "../../components/CheckoutForm";
import { usePaymentOptions, useShippingOptions } from "@/features/checkout/hooks/useCheckoutOptions";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useOrderStore } from "@/features/orders/store/orderStore";
import { VoucherCard } from "@/features/marketing/components/VoucherStrip";
import { useVouchers } from "@/features/marketing/hooks/useMarketing";
import { calculateVoucherDiscount } from "@/features/marketing/services/marketingService";
import type { CheckoutAddress, PaymentMethod, ShippingMethod } from "@/features/checkout/types/checkout";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

const checkoutCardClass =
  "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900";

const sectionIconClass =
  "bg-ocop-light text-ocop flex h-8 w-8 items-center justify-center rounded-full dark:bg-green-950/40";

const shippingIcons: Record<ShippingMethod, string> = {
  standard: "mdi:truck-delivery",
  express: "mdi:truck-fast",
  economy: "mdi:truck-outline",
};

function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-start gap-2.5">
      <span className={sectionIconClass}>
        <Icon icon={icon} width={18} />
      </span>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const { data: shippingOptions = [] } = useShippingOptions();
  const { data: paymentOptions = [] } = usePaymentOptions();
  const { data: vouchers = [] } = useVouchers();
  const { items, clearSelected } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      clearSelected: state.clearSelected,
    })),
  );
  const addOrder = useOrderStore((state) => state.addOrder);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>("standard");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cod");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucherId, setAppliedVoucherId] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

  const selectedItems = useMemo(() => items.filter((item) => item.selected), [items]);
  const shippingOption = shippingOptions.find((option) => option.method === selectedShipping) ?? shippingOptions[0];
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.snapshot.price * item.quantity, 0),
    [selectedItems],
  );
  const shippingFee = shippingOption?.price ?? 0;
  const appliedVoucher = vouchers.find((voucher) => voucher.id === appliedVoucherId);
  const voucherDiscount = appliedVoucher ? calculateVoucherDiscount(appliedVoucher, subtotal, shippingFee) : 0;
  const total = Math.max(subtotal + shippingFee - voucherDiscount, 0);

  useEffect(() => {
    if (selectedItems.length === 0 && !isFinalizingOrder) {
      navigate({ to: "/cart" });
    }
  }, [isFinalizingOrder, navigate, selectedItems.length]);

  const applyVoucher = (code = voucherCode) => {
    const normalizedCode = code.trim().toUpperCase();
    const voucher = vouchers.find((item) => item.code === normalizedCode);

    if (!voucher || new Date(voucher.expiresAt).getTime() < Date.now()) {
      setAppliedVoucherId(null);
      setVoucherError(t("checkout.invalidVoucher"));
      return;
    }

    if (subtotal < voucher.minSpend) {
      setAppliedVoucherId(null);
      setVoucherError(
        t("marketing.voucher.notEligible", {
          amount: formatCurrency(voucher.minSpend),
        }),
      );
      return;
    }

    setVoucherCode(voucher.code);
    setAppliedVoucherId(voucher.id);
    setVoucherError("");
  };

  const handlePlaceOrder = async (address: CheckoutAddress) => {
    if (!shippingOption || selectedItems.length === 0) return;

    setIsSubmitting(true);
    setIsFinalizingOrder(true);
    try {
      const order = await checkoutService.createOrder({
        status: "pending",
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          snapshot: {
            name: item.snapshot.name,
            image: item.snapshot.image,
            price: item.snapshot.price,
          },
        })),
        shippingAddress: address,
        shippingMethod: shippingOption,
        paymentMethod: selectedPayment,
        subtotal,
        shippingFee,
        discountAmount: voucherDiscount,
        total,
        voucherCode: appliedVoucher?.code ?? null,
      });

      addOrder(order);
      clearSelected();
      navigate({ to: "/order-success", search: { orderId: order.id } });
    } catch {
      setIsFinalizingOrder(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("checkout.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("checkout.subtitle")}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <section className={checkoutCardClass}>
            <CheckoutForm onSubmit={handlePlaceOrder} isSubmitting={isSubmitting} />
          </section>

          <section className={checkoutCardClass}>
            <SectionHeading icon="mdi:truck-delivery" title={t("checkout.shippingMethod")} />
            <RadioGroup
              value={selectedShipping}
              onValueChange={(value) => setSelectedShipping(value as ShippingMethod)}
              className="space-y-3"
            >
              {shippingOptions.map((option) => (
                <label
                  key={option.method}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
                    selectedShipping === option.method
                      ? "border-ocop bg-ocop-light/60 shadow-sm dark:bg-green-950/20"
                      : "hover:border-ocop/40 border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900",
                  )}
                >
                  <RadioGroupItem value={option.method} />
                  <span className="bg-ocop-light text-ocop hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex dark:bg-green-950/40">
                    <Icon icon={shippingIcons[option.method]} width={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-gray-900 dark:text-gray-100">{option.label}</span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      {option.provider} · {option.estimatedDays}
                    </span>
                  </span>
                  <span className="text-ocop font-bold">{formatCurrency(option.price)}</span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section className={checkoutCardClass}>
            <SectionHeading
              icon="mdi:credit-card-outline"
              title={t("checkout.paymentMethod")}
              subtitle={t("checkout.paymentMethodHint")}
            />
            <RadioGroup
              value={selectedPayment}
              onValueChange={(value) => setSelectedPayment(value as PaymentMethod)}
              className="space-y-3"
            >
              {paymentOptions.map((option) => (
                <label
                  key={option.method}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
                    selectedPayment === option.method
                      ? "border-ocop bg-ocop-light/60 shadow-sm dark:bg-green-950/20"
                      : "hover:border-ocop/40 border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900",
                  )}
                >
                  <RadioGroupItem value={option.method} />
                  <span className="bg-ocop-light text-ocop flex h-9 w-9 shrink-0 items-center justify-center rounded-xl dark:bg-green-950/40">
                    <Icon icon={option.icon} width={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                      {option.label}
                      {option.method === "cod" && (
                        <span className="bg-ocop-light text-ocop rounded-full px-2 py-0.5 text-[11px] font-bold dark:bg-green-950/40">
                          {t("checkout.popular")}
                        </span>
                      )}
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">{option.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <div className="space-y-4 xl:sticky xl:top-28 xl:h-fit">
          <aside className={checkoutCardClass}>
            <SectionHeading icon="mdi:shopping-outline" title={t("checkout.orderSummary")} />
            <div className="mt-4 space-y-3">
              {selectedItems.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img
                    src={item.snapshot.image}
                    alt={item.snapshot.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.snapshot.name}
                    </p>
                    {item.promotionType && (
                      <p className="text-ocop-amber text-[10px] font-bold uppercase">
                        {t(`marketing.promotion.${item.promotionType}`)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="text-ocop text-sm font-bold">{formatCurrency(item.snapshot.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("checkout.voucher")}
              </label>
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {vouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    selected={appliedVoucherId === voucher.id}
                    disabled={subtotal < voucher.minSpend}
                    onSelect={() => applyVoucher(voucher.code)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={voucherCode}
                  onChange={(event) => setVoucherCode(event.target.value)}
                  placeholder={t("checkout.voucherPlaceholder")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => applyVoucher()}
                  className="border-ocop text-ocop"
                >
                  {t("checkout.applyVoucher")}
                </Button>
              </div>
              {voucherError && <p className="text-ocop-red text-xs">{voucherError}</p>}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t("common.subtotal")}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t("common.shippingFee")}</span>
                <span>{shippingFee === 0 ? t("common.free") : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t("common.discount")}</span>
                <span>-{formatCurrency(voucherDiscount)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold dark:border-gray-800">
                <span className="text-gray-900 dark:text-gray-100">{t("common.total")}</span>
                <span className="text-ocop">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting || selectedItems.length === 0}
              className="bg-ocop hover:bg-ocop-dark mt-5 h-11 w-full rounded-xl text-white"
            >
              <Icon icon="mdi:lock-outline" width={16} />
              {isSubmitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
            </Button>
            <Button asChild variant="outline" className="mt-3 h-11 w-full rounded-xl">
              <Link to="/cart">{t("checkout.backToCart")}</Link>
            </Button>
          </aside>

          <div className={cn(checkoutCardClass, "grid grid-cols-3 gap-3 py-4 text-center")}>
            {[
              {
                icon: "mdi:shield-check-outline",
                title: t("checkout.trust.secure"),
                desc: t("checkout.trust.privacy"),
              },
              { icon: "mdi:headset", title: t("checkout.trust.support"), desc: t("checkout.trust.hotline") },
              { icon: "mdi:refresh", title: t("checkout.trust.return"), desc: t("checkout.trust.returnDesc") },
            ].map((item) => (
              <div key={item.icon} className="min-w-0">
                <Icon icon={item.icon} width={22} className="text-ocop mx-auto" />
                <p className="mt-2 text-xs font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
