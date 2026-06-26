import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/features/account/types/account";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const { t } = useTranslation("storefront");
  const fullAddress = [address.addressDetail, address.ward, address.district, address.province].join(", ");

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-ocop-light text-ocop rounded-full px-2.5 py-1 text-xs font-semibold dark:bg-green-950/30">
              {address.label}
            </span>
            {address.isDefault && (
              <span className="text-ocop-amber rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold dark:bg-amber-950/30">
                {t("profile.defaultAddress")}
              </span>
            )}
          </div>
          <p className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
            {address.fullName} · {address.phone}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{fullAddress}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hover:bg-ocop border-gray-200 text-gray-700 hover:text-white dark:border-gray-700 dark:text-gray-200"
          >
            <Icon icon="mdi:pencil-outline" width={14} />
            {t("profile.edit")}
          </Button>
          {!address.isDefault && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-ocop text-ocop hover:bg-ocop hover:text-white"
            >
              {t("profile.setDefault")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
