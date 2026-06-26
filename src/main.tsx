import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
// Initialize i18n
import "./config/i18n";
import { getRouter } from "./router";
import "./styles.css";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: 1
        }
    }
});

const router = getRouter();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <GooeyToaster position="top-center" closeButton />
        </QueryClientProvider>
    </StrictMode>
);
