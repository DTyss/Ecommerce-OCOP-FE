import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { CategoryDrawer } from "../mobile/CategoryDrawer";
import { SearchBar } from "./SearchBar";
import { StorefrontLogo } from "./StorefrontLogo";
import { useCartCount } from "@/features/cart/store/cartStore";
import { UserAvatar } from "@/features/account/components/UserAvatar";
import { useStorefrontAuthStore } from "@/features/account/store/authStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CartButton({ label }: { label: string }) {
  const count = useCartCount();
  return (
    <Link
      to="/cart"
      className="relative flex items-center gap-1.5 text-gray-700 hover:text-ocop dark:text-gray-200"
      aria-label={label}
    >
      <span className="relative" data-cart-fly-target="true">
        <Icon icon="mdi:cart-outline" width={26} />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ocop px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </span>
      <span className="hidden text-sm font-medium xl:inline">{label}</span>
    </Link>
  );
}

function WishlistButton({ label }: { label: string }) {
  const count = useWishlistStore((state) => state.productIds.length);

  return (
    <Link
      to="/wishlist"
      className="relative flex items-center gap-1.5 text-gray-700 hover:text-ocop dark:text-gray-200"
      aria-label={label}
    >
      <span className="relative">
        <Icon icon="mdi:heart-outline" width={26} />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ocop-red px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </span>
      <span className="hidden text-sm font-medium xl:inline">{label}</span>
    </Link>
  );
}

function AccountButton() {
  const { t } = useTranslation("storefront");
  const user = useStorefrontAuthStore((state) => state.user);
  const logout = useStorefrontAuthStore((state) => state.logout);

  if (!user) {
    return (
      <Link
        to="/account/login"
        className="flex items-center gap-1.5 text-gray-700 hover:text-ocop dark:text-gray-200"
      >
        <Icon icon="mdi:account-outline" width={26} />
        <span className="hidden flex-col items-start text-xs leading-tight xl:flex">
          <span className="font-medium">{t("header.login")}</span>
          <span className="text-gray-400">{t("header.account")}</span>
        </span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-gray-700 hover:text-ocop focus:outline-none dark:text-gray-200">
        <UserAvatar user={user} size="md" />
        <span className="hidden max-w-28 truncate text-sm font-medium xl:inline">
          {user.fullName}
        </span>
        <Icon icon="mdi:chevron-down" width={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <Icon icon="mdi:account-circle-outline" width={16} />
            {t("auth.myAccount")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders">
            <Icon icon="mdi:clipboard-text-outline" width={16} />
            {t("orders.title")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/wishlist">
            <Icon icon="mdi:heart-outline" width={16} />
            {t("wishlist.title")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <Icon icon="mdi:logout" width={16} />
          {t("auth.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StorefrontHeader() {
  const { t } = useTranslation("storefront");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header
      data-testid="storefront-glass-header"
      className="sticky top-0 z-30 border-b border-white/70 bg-white/64 shadow-[0_7px_24px_rgba(15,23,42,0.14)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-gray-900/68 dark:shadow-[0_7px_24px_rgba(0,0,0,0.38)]"
    >
      {/* Desktop main row */}
      <div className="hidden xl:block">
        <div className="container mx-auto flex items-center gap-6 px-4 py-3.5">
          <StorefrontLogo />
          <div className="flex-1">
            <SearchBar withButton />
          </div>
          <div className="flex items-center gap-6">
            <WishlistButton label={t("header.wishlist")} />
            <CartButton label={t("header.cart")} />
            <ThemeToggleButton className="px-0 text-gray-700 hover:text-ocop dark:text-gray-200 dark:hover:text-ocop-amber" />
            <AccountButton />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="xl:hidden">
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4">
          <button
            type="button"
            aria-label={t("header.openMenu")}
            onClick={() => setDrawerOpen(true)}
            className="text-gray-700 dark:text-gray-200"
          >
            <Icon icon="mdi:menu" width={26} />
          </button>
          <StorefrontLogo />
          <div className="flex items-center gap-2">
            <span className="max-[360px]:hidden">
              <WishlistButton label={t("header.wishlist")} />
            </span>
            <CartButton label={t("header.cart")} />
            <ThemeToggleButton
              compact
              className="px-0 text-gray-700 hover:text-ocop dark:text-gray-200 dark:hover:text-ocop-amber sm:px-0"
            />
            <span className="max-[360px]:hidden">
              <AccountButton />
            </span>
          </div>
        </div>
        <div className="px-4 pb-3">
          <SearchBar />
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-xs dark:border-gray-800">
          <span className="flex items-center gap-1 text-gray-500">
            <Icon
              icon="mdi:map-marker-outline"
              className="text-ocop"
              width={14}
            />
            {t("delivery.label")}:{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Hà Nội
            </span>
            <Icon icon="mdi:chevron-down" width={14} />
          </span>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full bg-ocop-light px-3 py-1 font-semibold text-ocop"
          >
            <Icon icon="mdi:lightning-bolt" width={14} />
            {t("delivery.fast")}
          </button>
        </div>
      </div>

      <CategoryDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </header>
  );
}
