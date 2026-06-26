import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import errorsEn from "./locales/errors.en.json";
import errorsVi from "./locales/errors.vi.json";
import vi from "./locales/vi.json";
// Feature translations
import storefrontEn from "@/features/storefront/i18n/en.json";
import storefrontVi from "@/features/storefront/i18n/vi.json";
import i18n from "i18next";

export const LANGUAGES = {
    vi: { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    en: { code: "en", name: "English", flag: "🇺🇸" }
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

const STORAGE_KEY = "language";
const DEFAULT_LANGUAGE: LanguageCode = "vi";

// Get saved language from localStorage or use default
const getSavedLanguage = (): LanguageCode => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved in LANGUAGES) {
            return saved as LanguageCode;
        }
    } catch {
        // Ignore localStorage errors
    }
    return DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
    resources: {
        vi: {
            translation: vi,
            apiErrors: errorsVi,
            storefront: storefrontVi
        },
        en: {
            translation: en,
            apiErrors: errorsEn,
            storefront: storefrontEn
        }
    },
    lng: getSavedLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
        escapeValue: false // React already escapes by default
    },
    returnNull: false,
    defaultNS: "translation",
    ns: ["translation", "apiErrors", "storefront"]
});

// Save language to localStorage when changed
i18n.on("languageChanged", (lng) => {
    try {
        localStorage.setItem(STORAGE_KEY, lng);
    } catch {
        // Ignore localStorage errors
    }
});

export default i18n;
