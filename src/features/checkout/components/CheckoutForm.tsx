import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutAddress } from "@/features/checkout/types/checkout";
import { cn } from "@/utils/utils";

interface CheckoutFormProps {
  onSubmit: (address: CheckoutAddress) => Promise<void> | void;
  isSubmitting?: boolean;
}

const defaultValues: CheckoutAddress = {
  fullName: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  addressDetail: "",
};

const fieldInputClass =
  "h-11 rounded-xl border-gray-200 bg-white text-sm shadow-sm focus:border-ocop focus:ring-2 focus:ring-ocop/20 dark:border-gray-800 dark:bg-gray-950";

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      {children} <span className="text-ocop-red">*</span>
    </Label>
  );
}

function FormSectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-ocop-light text-ocop flex h-8 w-8 items-center justify-center rounded-full dark:bg-green-950/40">
        <Icon icon={icon} width={18} />
      </span>
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{children}</h3>
    </div>
  );
}

function SelectLikeField({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error}
        className={cn(fieldInputClass, "pr-10")}
      />
      <Icon
        icon="mdi:chevron-down"
        width={18}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const { t } = useTranslation("storefront");
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
      <FormSectionTitle icon="mdi:account">{t("checkout.recipientInfo")}</FormSectionTitle>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field
          name="fullName"
          validators={{
            onChange: ({ value }) => (!value.trim() ? t("checkout.validation.fullNameRequired") : undefined),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <RequiredLabel htmlFor={field.name}>{t("checkout.fullName")}</RequiredLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder={t("checkout.placeholders.fullName")}
                error={field.state.meta.errors.length > 0}
                className={fieldInputClass}
              />
              {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>

        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => {
              const phone = value.trim();
              if (!phone) return t("checkout.validation.phoneRequired");
              if (!/^(0|\+84)[0-9]{8,9}$/.test(phone)) return t("checkout.validation.phoneInvalid");
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <RequiredLabel htmlFor={field.name}>{t("checkout.phone")}</RequiredLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder={t("checkout.placeholders.phone")}
                error={field.state.meta.errors.length > 0}
                className={fieldInputClass}
              />
              {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
      </div>

      <FormSectionTitle icon="mdi:map-marker-radius">{t("checkout.shippingAddress")}</FormSectionTitle>

      <div className="grid gap-4 md:grid-cols-2">
        {(["province", "district"] as const).map((name) => (
          <form.Field
            key={name}
            name={name}
            validators={{
              onChange: ({ value }) => (!value.trim() ? t("checkout.validation.addressRequired") : undefined),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <RequiredLabel htmlFor={field.name}>{t(`checkout.${name}`)}</RequiredLabel>
                <SelectLikeField
                  id={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder={t(`checkout.placeholders.${name}`)}
                  error={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form.Field
          name="ward"
          validators={{
            onChange: ({ value }) => (!value.trim() ? t("checkout.validation.addressRequired") : undefined),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <RequiredLabel htmlFor={field.name}>{t("checkout.ward")}</RequiredLabel>
              <SelectLikeField
                id={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={t("checkout.placeholders.ward")}
                error={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>

        <form.Field
          name="addressDetail"
          validators={{
            onChange: ({ value }) => (!value.trim() ? t("checkout.validation.addressRequired") : undefined),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <RequiredLabel htmlFor={field.name}>{t("checkout.addressDetail")}</RequiredLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder={t("checkout.placeholders.addressDetail")}
                error={field.state.meta.errors.length > 0}
                className={fieldInputClass}
              />
              {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Checkbox className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop size-4 rounded border-gray-300" />
        <span>{t("checkout.saveInfo")}</span>
      </label>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="bg-ocop hover:bg-ocop-dark hidden text-white"
          >
            {t("checkout.placeOrder")}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
