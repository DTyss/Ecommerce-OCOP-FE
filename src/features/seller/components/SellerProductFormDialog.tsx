import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, OcopStar } from "@/features/catalog/types/catalog";
import type { SellerProduct, SellerProductStatus } from "@/features/seller/types/seller";
import { CATEGORY_IMAGES } from "@/config/categoryImages";

interface SellerProductFormDialogProps {
  open: boolean;
  product: SellerProduct | null;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Omit<SellerProduct, "id" | "updatedAt">) => void;
}

type SellerProductFormValues = Omit<SellerProduct, "id" | "updatedAt">;

const defaultProduct: SellerProductFormValues = {
  name: "",
  price: 0,
  stock: 0,
  category: "",
  ocopStar: 4,
  status: "pending",
  image: CATEGORY_IMAGES.food,
  soldCount: 0,
};

export function SellerProductFormDialog({
  open,
  product,
  categories,
  onOpenChange,
  onSubmit,
}: SellerProductFormDialogProps) {
  const { t } = useTranslation("storefront");
  const form = useForm({
    defaultValues: product
      ? {
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          ocopStar: product.ocopStar,
          status: product.status,
          image: product.image,
          soldCount: product.soldCount,
        }
      : defaultProduct,
    onSubmit: ({ value }) => {
      onSubmit(value);
      onOpenChange(false);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>{product ? t("sellerProduct.edit") : t("sellerProduct.add")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => (value.trim() ? undefined : t("sellerForm.required")),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t("sellerProduct.name")}</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
              </div>
            )}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="price"
              validators={{
                onChange: ({ value }) => (value > 0 ? undefined : t("sellerProduct.invalidNumber")),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>{t("sellerProduct.price")}</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(Number(event.target.value))}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                  {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>

            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) => (value >= 0 ? undefined : t("sellerProduct.invalidNumber")),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>{t("sellerProduct.stock")}</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(Number(event.target.value))}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                  {field.state.meta.errors[0] && <p className="text-ocop-red text-xs">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <form.Field
              name="category"
              validators={{
                onChange: ({ value }) => (value ? undefined : t("sellerForm.required")),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label>{t("filter.category")}</Label>
                  <Select value={field.state.value} onValueChange={field.handleChange}>
                    <SelectTrigger className="dark:border-gray-700 dark:bg-gray-800">
                      <SelectValue placeholder={t("filter.category")} />
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

            <form.Field name="ocopStar">
              {(field) => (
                <div className="space-y-2">
                  <Label>{t("filter.ocopStar")}</Label>
                  <Select
                    value={String(field.state.value)}
                    onValueChange={(value) => field.handleChange(Number(value) as OcopStar)}
                  >
                    <SelectTrigger className="dark:border-gray-700 dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5].map((star) => (
                        <SelectItem key={star} value={String(star)}>
                          {t("product.ocopStar", { star })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <Label>{t("sellerProduct.status")}</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as SellerProductStatus)}
                  >
                    <SelectTrigger className="dark:border-gray-700 dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["active", "outOfStock", "pending"] as const).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`sellerProduct.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="image">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t("sellerProduct.image")}</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button type="submit" disabled={!canSubmit} className="bg-ocop hover:bg-ocop-dark w-full text-white">
                {product ? t("sellerProduct.save") : t("sellerProduct.add")}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
