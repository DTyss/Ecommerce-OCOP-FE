import { createFileRoute, Outlet } from "@tanstack/react-router";
import StorefrontLayout from "@/layouts/storefront/StorefrontLayout";

export const Route = createFileRoute("/_storefront")({
    component: LayoutComponent
});

function LayoutComponent() {
    return (
        <StorefrontLayout>
            <Outlet />
        </StorefrontLayout>
    );
}
