import { useTranslation } from "react-i18next";
import { Link, useRouterState } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/utils";

const LINKS = [
  {
    key: "dashboard",
    icon: "mdi:view-dashboard-outline",
    to: "/seller/dashboard",
  },
  {
    key: "products",
    icon: "mdi:package-variant-closed",
    to: "/seller/products",
  },
] as const;

export function SellerNav() {
  const { t } = useTranslation("storefront");
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.to);

          return (
            <Link
              key={link.key}
              to={link.to}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-ocop text-white"
                  : "hover:bg-ocop-light hover:text-ocop text-gray-600 dark:text-gray-300 dark:hover:bg-green-950/30",
              )}
            >
              <Icon icon={link.icon} width={18} />
              {t(`sellerCenter.${link.key}`)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
