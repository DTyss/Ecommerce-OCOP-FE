import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useCategories } from "@/features/catalog/hooks/useCatalog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/utils/utils";

interface CategoryDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CategoryDrawer({ open, onOpenChange }: CategoryDrawerProps) {
    const { t } = useTranslation("storefront");
    const { data: categories } = useCategories();
    const [categoryOpen, setCategoryOpen] = useState(true);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="bg-ocop px-4 py-4 text-left">
                    <SheetTitle className="flex items-center gap-2 text-white dark:text-white">
                        <Icon icon="mdi:menu" width={20} />
                        {t("sidebar.menuTitle")}
                    </SheetTitle>
                </SheetHeader>
                <nav className="space-y-3 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to="/regions"
                            onClick={() => onOpenChange(false)}
                            className="flex flex-col items-center gap-2 rounded-2xl bg-ocop-50 p-3 text-center text-xs font-bold text-ocop dark:bg-green-950/30"
                        >
                            <Icon icon="mdi:compass-outline" width={24} />
                            {t("ocop.navigation.regions")}
                        </Link>
                        <Link
                            to="/ocop-map"
                            search={{}}
                            onClick={() => onOpenChange(false)}
                            className="flex flex-col items-center gap-2 rounded-2xl bg-ocop-amber/10 p-3 text-center text-xs font-bold text-ocop-800 dark:bg-ocop-amber/10 dark:text-ocop-amber"
                        >
                            <Icon icon="mdi:map-outline" width={24} />
                            {t("ocop.navigation.map")}
                        </Link>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-ocop-border-soft bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <button
                            type="button"
                            aria-expanded={categoryOpen}
                            onClick={() => setCategoryOpen((value) => !value)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold text-gray-900 transition-colors hover:bg-ocop-light dark:text-gray-100 dark:hover:bg-green-950/30"
                        >
                            <span className="flex items-center gap-2.5">
                                <Icon
                                    icon="mdi:view-grid-outline"
                                    className="text-ocop"
                                    width={20}
                                />
                                {t("sidebar.categoryTitle")}
                            </span>
                            <Icon
                                icon="mdi:chevron-down"
                                className={cn(
                                    "text-gray-400 transition-transform",
                                    categoryOpen && "rotate-180",
                                )}
                                width={18}
                            />
                        </button>

                        {categoryOpen && (
                            <ul className="border-t border-ocop-border-soft py-1 dark:border-gray-800">
                                {categories?.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            to="/category/$slug"
                                            params={{ slug: category.slug }}
                                            onClick={() => onOpenChange(false)}
                                            className="flex items-center justify-between gap-2 px-4 py-3 text-sm text-foreground transition-colors hover:bg-ocop-light hover:text-ocop dark:hover:bg-green-950/30"
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <Icon
                                                    icon={category.icon}
                                                    className="text-muted-foreground"
                                                    width={20}
                                                />
                                                {category.name}
                                            </span>
                                            <Icon
                                                icon="mdi:chevron-right"
                                                className="text-muted-foreground"
                                                width={16}
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Link
                        to="/seller/register"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-ocop-amber/30 bg-gradient-to-br from-ocop-50 via-white to-ocop-amber/15 px-4 py-3 text-sm font-bold text-ocop-800 shadow-sm transition-colors hover:border-ocop-amber/50 hover:bg-ocop-50 dark:border-ocop-amber/20 dark:from-green-950/30 dark:via-gray-900 dark:to-ocop-amber/10 dark:text-green-300"
                    >
                        <span className="flex items-center gap-2.5">
                            <Icon icon="mdi:store-plus-outline" width={21} />
                            {t("seller.title")}
                        </span>
                        <Icon icon="mdi:chevron-right" width={18} />
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
