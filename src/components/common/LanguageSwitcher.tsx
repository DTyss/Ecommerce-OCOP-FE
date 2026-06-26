import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { LANGUAGES, type LanguageCode } from "@/config/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.language in LANGUAGES ? i18n.language : "vi") as LanguageCode;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change language"
          className="text-link dark:text-darklink hover:text-primary flex items-center gap-1 rounded-full px-3 py-2"
        >
          <span>{LANGUAGES[current].flag}</span>
          <Icon icon="tabler:chevron-down" width={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(LANGUAGES).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <span>{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
