import { FC, ReactNode } from "react";
import { SupportChatButton } from "@/features/storefront/components/SupportChatButton";
import { BottomTabBar } from "./mobile/BottomTabBar";
import { StorefrontFooter } from "./footer/StorefrontFooter";
import { StorefrontHeader } from "./header/StorefrontHeader";
import { TopUtilityBar } from "./header/TopUtilityBar";

const StorefrontLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="storefront-page-background flex min-h-screen flex-col bg-ocop-page font-[Inter,sans-serif] text-gray-800 dark:bg-gray-950 dark:text-gray-100">
            <TopUtilityBar />
            <StorefrontHeader />

            <main className="container mx-auto w-full flex-1 px-4 pb-24 pt-5 xl:pb-10">{children}</main>
            <StorefrontFooter />

            <SupportChatButton />
            <BottomTabBar />
        </div>
    );
};

export default StorefrontLayout;
