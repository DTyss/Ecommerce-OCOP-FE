import { tanstackRouter } from "@tanstack/router-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
    base: "/",
    plugins: [
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tailwindcss(),
        viteReact(),
        tanstackRouter({
            routeToken: "layout"
        })
        // mkcert({ hosts: ["localhost", "admin.oneship.local"] })
    ],
    server: {
        host: true
    }
});

export default config;
