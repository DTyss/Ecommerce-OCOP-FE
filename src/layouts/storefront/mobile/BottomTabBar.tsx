import { useTranslation } from "react-i18next";
import { Link, useRouterState } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useCartCount } from "@/features/cart/store/cartStore";
import { cn } from "@/utils/utils";

const TABS = [
  { key: "home", icon: "mdi:home-variant-outline", to: "/" },
  { key: "categories", icon: "mdi:view-grid-outline", to: "/category" },
  { key: "cart", icon: "mdi:cart-outline", to: "/cart" },
  { key: "orders", icon: "mdi:clipboard-text-outline", to: "/orders" },
] as const;

export function BottomTabBar() {
  const { t } = useTranslation("storefront");
  const cartCount = useCartCount();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 overflow-hidden border-t border-border bg-card xl:hidden">
      <ul className="grid grid-cols-4 items-stretch">
        {TABS.map((tab) => {
          const active =
            "to" in tab &&
            (tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to));
          const content = (
            <>
              <span
                className="relative shrink-0"
                data-cart-fly-target={tab.key === "cart" ? "true" : undefined}
              >
                <Icon icon={tab.icon} width={22} />
                {tab.key === "cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ocop px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="max-w-full truncate leading-tight">
                {t(`bottomNav.${tab.key}`)}
              </span>
            </>
          );

          return (
            <li key={tab.key} className="min-w-0">
              {"to" in tab ? (
                <Link
                  to={tab.to}
                  className={cn(
                    "flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[11px]",
                    active ? "text-ocop" : "text-gray-500",
                  )}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  className="flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[11px] text-gray-500"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
