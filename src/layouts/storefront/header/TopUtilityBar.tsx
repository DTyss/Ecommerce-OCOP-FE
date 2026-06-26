import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";

export function TopUtilityBar() {
    const { t } = useTranslation("storefront");

    return (
        <div className="hidden border-b border-white/60 bg-white/48 backdrop-blur-lg backdrop-saturate-150 dark:border-white/10 dark:bg-gray-950/62 xl:block">
            <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span>{t("topbar.welcome")}</span>
                    <Link to="/regions" className="flex items-center gap-1 hover:text-ocop">
                        <Icon icon="mdi:compass-outline" width={14} />
                        {t("ocop.navigation.regions")}
                    </Link>
                    <Link to="/ocop-map" search={{}} className="flex items-center gap-1 hover:text-ocop">
                        <Icon icon="mdi:map-outline" width={14} />
                        {t("ocop.navigation.map")}
                    </Link>
                    <span className="flex items-center gap-1">
                        <Icon icon="mdi:map-marker-outline" width={14} />
                        {t("delivery.label")}: <span className="font-medium text-foreground">Hà Nội</span>
                        <Icon icon="mdi:chevron-down" width={14} />
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-ocop">{t("topbar.support")}</a>
                    <Link to="/seller/dashboard" className="hover:text-ocop">{t("topbar.sellerCenter")}</Link>
                    <a href="#" className="hover:text-ocop">{t("topbar.downloadApp")}</a>
                    <span className="flex items-center gap-2">
                        {t("topbar.connect")}
                        <a href="#" aria-label="Facebook" className="hover:text-ocop"><Icon icon="mdi:facebook" width={16} /></a>
                        <a href="#" aria-label="YouTube" className="hover:text-ocop"><Icon icon="mdi:youtube" width={16} /></a>
                    </span>
                </div>
            </div>
        </div>
    );
}
