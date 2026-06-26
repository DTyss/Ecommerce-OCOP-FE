import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export function SupportChatButton() {
  const { t } = useTranslation("storefront");

  return (
    <button
      type="button"
      className="bg-ocop hover:bg-ocop-dark fixed right-4 bottom-20 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors xl:bottom-6"
    >
      <Icon icon="mdi:chat-processing-outline" width={20} />
      <span className="hidden sm:inline">{t("chat.support")}</span>
    </button>
  );
}
