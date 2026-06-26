import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/utils";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ page, totalPages, onPageChange }: ProductPaginationProps) {
  const { t } = useTranslation("storefront");
  const pageItems = getPageItems(page, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label={t("pagination.navigation")}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label={t("pagination.previous")}
        className="hover:border-ocop hover:text-ocop flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <Icon icon="mdi:chevron-left" width={18} />
      </button>
      {pageItems.map((pageItem, index) =>
        pageItem === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 min-w-9 items-center justify-center text-sm text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={pageItem}
            type="button"
            onClick={() => onPageChange(pageItem)}
            aria-label={t("pagination.page", { page: pageItem })}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors",
              pageItem === page
                ? "border-ocop bg-ocop text-white"
                : "hover:border-ocop hover:text-ocop border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
            )}
          >
            {pageItem}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label={t("pagination.next")}
        className="hover:border-ocop hover:text-ocop flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <Icon icon="mdi:chevron-right" width={18} />
      </button>
    </nav>
  );
}

function getPageItems(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }).map((_, index) => index + 1);
  }

  const middle = [page - 1, page, page + 1].filter((item) => item > 1 && item < totalPages);
  const unique = [...new Set([1, ...middle, totalPages])].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  unique.forEach((item, index) => {
    const previous = unique[index - 1];

    if (previous && item - previous > 1) {
      items.push("ellipsis");
    }

    items.push(item);
  });

  return items;
}
