/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_PREFIX: string;
    readonly VITE_CDN_BASE_URL: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_AUTH_TOKEN_EXPIRES_MINUTES: string;
    readonly VITE_AUTH_USER_EXPIRES_DAYS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
