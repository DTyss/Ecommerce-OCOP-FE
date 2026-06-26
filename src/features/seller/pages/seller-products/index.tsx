import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { SellerNav } from "../../components/SellerNav";
import { SellerProductFormDialog } from "../../components/SellerProductFormDialog";
import { SellerProductTable } from "../../components/SellerProductTable";
import { useCategories } from "@/features/catalog/hooks/useCatalog";
import { useSellerStore } from "@/features/seller/store/sellerStore";
import type { SellerProduct, SellerProductStatus } from "@/features/seller/types/seller";
import { cn } from "@/utils/utils";

const STATUS_FILTERS = ["all", "active", "outOfStock", "pending"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function SellerProductsPage() {
  const { t } = useTranslation("storefront");
  const { data: categories = [] } = useCategories();
  const products = useSellerStore((state) => state.products);
  const addProduct = useSellerStore((state) => state.addProduct);
  const updateProduct = useSellerStore((state) => state.updateProduct);
  const removeProduct = useSellerStore((state) => state.removeProduct);
  const setProductStatus = useSellerStore((state) => state.setProductStatus);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  const filteredProducts = useMemo(
    () => (statusFilter === "all" ? products : products.filter((product) => product.status === statusFilter)),
    [products, statusFilter],
  );

  const openAddDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: SellerProduct) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = (product: Omit<SellerProduct, "id" | "updatedAt">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
      return;
    }

    addProduct(product);
  };

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-ocop">
          {t("bottomNav.home")}
        </Link>
        <Icon icon="mdi:chevron-right" width={16} />
        <span className="font-medium text-gray-900 dark:text-gray-100">{t("sellerCenter.products")}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SellerNav />

        <div className="min-w-0 space-y-5">
          <header className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p className="text-ocop text-sm font-semibold uppercase">{t("sellerCenter.title")}</p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t("sellerCenter.manageProducts")}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("sellerProduct.count", { count: products.length })}
              </p>
            </div>
            <Button type="button" onClick={openAddDialog} className="bg-ocop hover:bg-ocop-dark text-white">
              <Icon icon="mdi:plus" width={18} />
              {t("sellerProduct.add")}
            </Button>
          </header>

          <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                  statusFilter === status
                    ? "bg-ocop text-white"
                    : "hover:bg-ocop-light hover:text-ocop bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-950/30",
                )}
              >
                {status === "all" ? t("orders.tabs.all") : t(`sellerProduct.${status}`)}
              </button>
            ))}
          </div>

          <SellerProductTable
            products={filteredProducts}
            onEdit={openEditDialog}
            onDelete={removeProduct}
            onStatusChange={(id, status: SellerProductStatus) => setProductStatus(id, status)}
          />
        </div>
      </div>

      <SellerProductFormDialog
        key={editingProduct?.id ?? "new"}
        open={dialogOpen}
        product={editingProduct}
        categories={categories}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
