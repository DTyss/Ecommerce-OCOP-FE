import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, type LanguageCode } from "@/config/i18n";

export function useLanguage() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language as LanguageCode;
    const currentLanguageInfo = LANGUAGES[currentLanguage] || LANGUAGES.vi;

    const changeLanguage = useCallback(
        (lang: LanguageCode) => {
            i18n.changeLanguage(lang);
        },
        [i18n]
    );

    const toggleLanguage = useCallback(() => {
        const newLang = currentLanguage === "vi" ? "en" : "vi";
        changeLanguage(newLang);
    }, [currentLanguage, changeLanguage]);

    return {
        currentLanguage,
        currentLanguageInfo,
        languages: LANGUAGES,
        changeLanguage,
        toggleLanguage
    };
}
