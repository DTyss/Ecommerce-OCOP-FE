import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SellerProduct, SellerProductStatus } from "@/features/seller/types/seller";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

interface SellerProductTableProps {
  products: SellerProduct[];
  onEdit: (product: SellerProduct) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SellerProductStatus) => void;
}

const statusClass = {
  active: "bg-ocop-light text-ocop dark:bg-green-950/30 dark:text-green-300",
  outOfStock: "bg-red-50 text-ocop-red dark:bg-red-950/30",
  pending: "bg-amber-50 text-ocop-amber dark:bg-amber-950/30",
};

export function SellerProductTable({ products, onEdit, onDelete, onStatusChange }: SellerProductTableProps) {
  const { t } = useTranslation("storefront");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("sellerProduct.product")}</TableHead>
            <TableHead>{t("filter.category")}</TableHead>
            <TableHead>{t("sellerProduct.stock")}</TableHead>
            <TableHead>{t("sellerProduct.status")}</TableHead>
            <TableHead className="text-right">{t("sellerProduct.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex min-w-64 items-center gap-3">
                  <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-ocop font-bold">{formatCurrency(product.price)}</span>
                      <span className="text-ocop-amber">{t("product.ocopStar", { star: product.ocopStar })}</span>
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Select
                  value={product.status}
                  onValueChange={(value) => onStatusChange(product.id, value as SellerProductStatus)}
                >
                  <SelectTrigger className="h-9 w-36 dark:border-gray-700 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["active", "outOfStock", "pending"] as const).map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", statusClass[status])}>
                          {t(`sellerProduct.${status}`)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t("sellerProduct.edit")}
                    onClick={() => onEdit(product)}
                    className="hover:text-ocop h-9 w-9 border-gray-200 text-gray-500 dark:border-gray-700"
                  >
                    <Icon icon="mdi:pencil-outline" width={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t("sellerProduct.delete")}
                    onClick={() => onDelete(product.id)}
                    className="hover:text-ocop-red h-9 w-9 border-gray-200 text-gray-500 dark:border-gray-700"
                  >
                    <Icon icon="mdi:trash-can-outline" width={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
