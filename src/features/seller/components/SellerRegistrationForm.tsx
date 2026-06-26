import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, Region } from "@/features/catalog/types/catalog";
import type { SellerRegistrationDraft } from "@/features/seller/types/seller";
import { cn } from "@/utils/utils";

interface SellerRegistrationFormProps {
  categories: Category[];
  regions: Region[];
  onSubmit: (draft: SellerRegistrationDraft) => void;
}

const defaultValues: SellerRegistrationDraft = {
  shopName: "",
  ownerName: "",
  phone: "",
  email: "",
  region: "",
  businessAddress: "",
  businessLicense: "",
  socialLink: "",
  productCategory: "",
  mainProduct: "",
  shopDescription: "",
  logoFileName: "",
  ocopCertificateCode: "",
  acceptedTerms: false,
};

const inputClass = "h-10 pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

function RequiredMark() {
  return <span className="text-ocop-red">*</span>;
}

function FieldIcon({ icon }: { icon: string }) {
  return <Icon icon={icon} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" width={17} />;
}

function SectionHeading({ icon, children }: { icon: string; children: string }) {
  return (
    <h2 className="text-ocop flex items-center gap-2 text-sm font-bold uppercase">
      <Icon icon={icon} width={19} />
      {children}
    </h2>
  );
}

export function SellerRegistrationForm({ categories, regions, onSubmit }: SellerRegistrationFormProps) {
  const { t } = useTranslation("storefront");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => onSubmit(value),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <SectionHeading icon="mdi:storefront-outline">{t("sellerForm.shopInfo")}</SectionHeading>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="shopName"
            validators={{
              onChange: ({ value }) => (value.trim() ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.shopName")} <RequiredMark />
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  placeholder={t("sellerForm.placeholders.shopName")}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="h-10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>

          <form.Field
            name="ownerName"
            validators={{
              onChange: ({ value }) => (value.trim() ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.ownerName")} <RequiredMark />
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  placeholder={t("sellerForm.placeholders.ownerName")}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="h-10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="phone"
            validators={{
              onChange: ({ value }) => {
                const phone = value.trim();
                if (!phone) return t("sellerForm.required");
                if (!/^(0|\+84)[0-9]{8,9}$/.test(phone)) {
                  return t("sellerForm.invalidPhone");
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.phone")} <RequiredMark />
                </Label>
                <div className="relative">
                  <FieldIcon icon="mdi:phone-outline" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    placeholder={t("sellerForm.placeholders.phone")}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className={inputClass}
                  />
                </div>
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const email = value.trim();
                if (!email) return t("sellerForm.required");
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  return t("sellerForm.invalidEmail");
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.email")} <RequiredMark />
                </Label>
                <div className="relative">
                  <FieldIcon icon="mdi:email-outline" />
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    placeholder={t("sellerForm.placeholders.email")}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className={inputClass}
                  />
                </div>
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="region"
            validators={{
              onChange: ({ value }) => (value ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label>
                  {t("sellerForm.region")} <RequiredMark />
                </Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger className="h-10 dark:border-gray-700 dark:bg-gray-800">
                    <SelectValue placeholder={t("sellerForm.placeholders.region")} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions
                      .filter((region) => region.id !== "all")
                      .map((region) => (
                        <SelectItem key={region.id} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>

          <form.Field
            name="businessAddress"
            validators={{
              onChange: ({ value }) => (value.trim() ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.businessAddress")} <RequiredMark />
                </Label>
                <div className="relative">
                  <FieldIcon icon="mdi:map-marker-outline" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    placeholder={t("sellerForm.placeholders.businessAddress")}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className={inputClass}
                  />
                </div>
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 border-b border-dashed border-gray-200 pb-4 md:grid-cols-2 dark:border-gray-800">
          <form.Field name="businessLicense">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.businessLicense")}{" "}
                  <span className="font-normal text-gray-400">({t("sellerForm.optional")})</span>
                </Label>
                <div className="relative">
                  <FieldIcon icon="mdi:card-account-details-outline" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    placeholder={t("sellerForm.placeholders.businessLicense")}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="socialLink">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.socialLink")}{" "}
                  <span className="font-normal text-gray-400">({t("sellerForm.optional")})</span>
                </Label>
                <div className="relative">
                  <FieldIcon icon="mdi:web" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    placeholder={t("sellerForm.placeholders.socialLink")}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading icon="mdi:shape-outline">{t("sellerForm.productInfo")}</SectionHeading>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="productCategory"
            validators={{
              onChange: ({ value }) => (value ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label>
                  {t("sellerForm.productCategory")} <RequiredMark />
                </Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger className="h-10 dark:border-gray-700 dark:bg-gray-800">
                    <SelectValue placeholder={t("sellerForm.placeholders.productCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>

          <form.Field
            name="mainProduct"
            validators={{
              onChange: ({ value }) => (value.trim() ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.mainProduct")} <RequiredMark />
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  placeholder={t("sellerForm.placeholders.mainProduct")}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="h-10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field
            name="shopDescription"
            validators={{
              onChange: ({ value }) => (value.trim() ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  {t("sellerForm.shopDescription")} <RequiredMark />
                </Label>
                <textarea
                  id={field.name}
                  value={field.state.value}
                  maxLength={500}
                  placeholder={t("sellerForm.placeholders.shopDescription")}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  className={cn(
                    "focus:ring-primary-300 min-h-24 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition outline-none focus:border-transparent focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
                    field.state.meta.errors.length > 0 && "border-error-500 focus:ring-error-500",
                  )}
                />
                <div className="flex items-center justify-between gap-3">
                  {field.state.meta.errors[0] ? (
                    <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-400">{field.state.value.length}/500</span>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field
            name="logoFileName"
            validators={{
              onChange: ({ value }) => (value ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label>
                  {t("sellerForm.logo")} <RequiredMark />
                </Label>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className={cn(
                    "hover:border-ocop hover:bg-ocop-light flex min-h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center transition dark:border-gray-700 dark:bg-gray-800/60",
                    field.state.meta.errors.length > 0 && "border-ocop-red",
                  )}
                >
                  <span className="bg-ocop-light text-ocop flex h-9 w-9 items-center justify-center rounded-full">
                    <Icon icon="mdi:cloud-upload-outline" width={21} />
                  </span>
                  <span className="text-ocop mt-2 text-sm font-semibold">
                    {field.state.value || t("sellerForm.uploadLogo")}
                  </span>
                  <span className="mt-1 text-xs text-gray-400">{t("sellerForm.uploadHint")}</span>
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(event) => field.handleChange(event.target.files?.[0]?.name ?? "")}
                />
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div className="space-y-3 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800">
        <SectionHeading icon="mdi:shield-check-outline">{t("sellerForm.confirm")}</SectionHeading>
        <form.Field
          name="acceptedTerms"
          validators={{
            onChange: ({ value }) => (value ? undefined : t("sellerForm.acceptTermsRequired")),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked === true)}
                  className="data-[state=checked]:border-ocop data-[state=checked]:bg-ocop mt-0.5"
                />
                <span>
                  {t("sellerForm.confirmText")}{" "}
                  <a href="#" className="text-ocop hover:text-ocop-dark font-semibold">
                    {t("auth.terms")}
                  </a>{" "}
                  {t("sellerForm.and")}{" "}
                  <a href="#" className="text-ocop hover:text-ocop-dark font-semibold">
                    {t("auth.privacy")}
                  </a>{" "}
                  {t("sellerForm.ofOcop")}
                </span>
              </label>
              {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit} className="bg-ocop hover:bg-ocop-dark h-11 px-7 text-white">
            <Icon icon="mdi:send" width={18} />
            {t("sellerForm.submit")}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
