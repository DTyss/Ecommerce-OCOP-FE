import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useCategories } from "@/features/catalog/hooks/useCatalog";
import { Skeleton } from "@/components/ui/skeleton";

export function CategorySidebar() {
  const { t } = useTranslation("storefront");
  const { data: categories, isLoading } = useCategories();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4">
      <nav
        data-testid="home-category-glass"
        className="ring-ocop/10 overflow-hidden rounded-2xl border border-white/52 bg-white/14 shadow-[0_12px_32px_rgba(15,23,42,0.10)] ring-1 backdrop-saturate-150 dark:border-white/10 dark:bg-gray-900/58 dark:ring-white/5"
      >
        <Link
          to="/category"
          className="bg-ocop/94 hover:bg-ocop-dark flex items-center gap-2 border-b border-white/20 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-colors"
        >
          <Icon icon="mdi:menu" width={18} />
          {t("sidebar.categoryTitle")}
        </Link>
        <ul className="py-1.5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="px-4 py-2.5">
                  <Skeleton className="h-4 w-40" />
                </li>
              ))
            : categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: category.slug }}
                    className="group hover:text-ocop flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-white/32 dark:text-gray-300 dark:hover:bg-green-950/35"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon icon={category.icon} className="group-hover:text-ocop text-gray-400" width={18} />
                      {category.name}
                    </span>
                    <Icon
                      icon="mdi:chevron-right"
                      className="group-hover:text-ocop text-gray-300 transition-transform group-hover:translate-x-0.5"
                      width={16}
                    />
                  </Link>
                </li>
              ))}
        </ul>
      </nav>

      {/* Seller CTA */}
      <div
        data-testid="home-seller-glass"
        className="via-ocop-50/12 to-ocop-amber/4 ring-ocop/12 relative overflow-hidden rounded-2xl border border-white/52 bg-gradient-to-br from-white/20 p-4 text-center shadow-[0_12px_32px_rgba(11,107,58,0.12)] ring-1 backdrop-saturate-150 dark:border-white/10 dark:from-gray-900/58 dark:via-green-950/32 dark:to-amber-950/12 dark:ring-white/5"
      >
        <div className="bg-ocop-amber/12 pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl" />
        <div className="bg-ocop/10 pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full blur-2xl" />
        <span className="bg-ocop relative mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_8px_20px_rgba(11,107,58,0.24)] ring-4 ring-white/55 dark:ring-gray-900/50">
          <Icon icon="mdi:store-plus-outline" width={26} />
        </span>
        <p className="text-ocop-dark relative mt-3 text-sm leading-5 font-bold dark:text-green-300">
          {t("seller.title")}
        </p>
        <p className="relative mx-auto mt-1 max-w-40 text-xs leading-5 text-gray-600 dark:text-gray-400">
          {t("seller.desc")}
        </p>
        <Link
          to="/seller/register"
          className="bg-ocop hover:bg-ocop-dark relative mt-3 flex w-full items-center justify-center rounded-full px-3 py-2 text-center text-xs leading-5 font-semibold text-white shadow-[0_6px_16px_rgba(11,107,58,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(11,107,58,0.28)]"
        >
          {t("seller.button")}
        </Link>
      </div>
    </aside>
  );
}
