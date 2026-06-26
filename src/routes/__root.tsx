import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/provider/ThemeProvider";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Outlet />
        </ThemeProvider>
    );
}
