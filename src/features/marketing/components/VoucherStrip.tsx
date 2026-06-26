import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useVouchers } from "@/features/marketing/hooks/useMarketing";
import type { Voucher } from "@/features/marketing/types/marketing";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

export function VoucherStrip() {
  const { t } = useTranslation("storefront");
  const { data: vouchers = [], isLoading } = useVouchers();

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="bg-ocop-amber/15 text-ocop-amber flex h-10 w-10 items-center justify-center rounded-full">
          <Icon icon="mdi:ticket-percent-outline" width={22} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("marketing.voucher.title")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("marketing.voucher.subtitle")}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)
          : vouchers.map((voucher) => <VoucherCard key={voucher.id} voucher={voucher} />)}
      </div>
    </section>
  );
}

export function VoucherCard({
  voucher,
  selected = false,
  disabled = false,
  onSelect,
}: {
  voucher: Voucher;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const { t } = useTranslation("storefront");
  const value =
    voucher.type === "freeShipping"
      ? t("marketing.voucher.freeShipping")
      : voucher.type === "percentage"
        ? t("marketing.voucher.percentOff", { value: voucher.value })
        : t("marketing.voucher.fixedOff", {
            value: formatCurrency(voucher.value),
          });

  const content = (
    <>
      <span className="bg-ocop-amber/15 text-ocop-amber flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
        <Icon icon="mdi:ticket-percent" width={26} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-ocop block font-bold">{value}</span>
        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
          {t("marketing.voucher.minSpend", {
            amount: formatCurrency(voucher.minSpend),
          })}
        </span>
        <span className="mt-2 inline-flex rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {voucher.code}
        </span>
      </span>
      {onSelect && (
        <span className="text-ocop text-xs font-bold">
          {selected ? t("marketing.voucher.selected") : t("marketing.voucher.select")}
        </span>
      )}
    </>
  );

  const classes = cn(
    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
    selected
      ? "border-ocop bg-ocop-50 dark:bg-green-950/20"
      : "border-ocop-amber/25 bg-white dark:border-ocop-amber/15 dark:bg-gray-900",
    disabled ? "cursor-not-allowed opacity-50" : "hover:border-ocop/40",
  );

  return onSelect ? (
    <button type="button" disabled={disabled} onClick={onSelect} className={classes}>
      {content}
    </button>
  ) : (
    <div className={classes}>{content}</div>
  );
}
