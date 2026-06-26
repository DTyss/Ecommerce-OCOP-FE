import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { fuzzySearchProducts } from "@/features/discovery/utils/productDiscovery";
import { useProducts } from "@/features/catalog/hooks/useCatalog";
import type { Product } from "@/features/catalog/types/catalog";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/utils";

interface SearchBarProps {
  /** Desktop variant shows a separate green "Search" button. */
  withButton?: boolean;
  className?: string;
}

export function SearchBar({ withButton = false, className }: SearchBarProps) {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const formRef = useRef<HTMLFormElement>(null);
  const listboxId = useId();
  const productsQuery = useProducts();
  const normalizedKeyword = keyword.trim();
  const debouncedKeyword = useDebounce(normalizedKeyword, 300);
  const currentKeyword =
    location.pathname === "/search"
      ? ((location.search as { keyword?: string }).keyword ?? "")
      : "";
  const suggestions = useMemo(
    () =>
      debouncedKeyword.length >= 2
        ? fuzzySearchProducts(productsQuery.data ?? [], debouncedKeyword, 6)
        : [],
    [debouncedKeyword, productsQuery.data],
  );
  const canShowSuggestions = isOpen && normalizedKeyword.length >= 2;
  const isSearching =
    canShowSuggestions &&
    (normalizedKeyword !== debouncedKeyword || productsQuery.isLoading);

  useEffect(() => {
    setKeyword(currentKeyword);
    setIsOpen(false);
  }, [currentKeyword]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedKeyword]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!formRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const submitKeyword = () => {
    const normalizedKeyword = keyword.trim();

    setIsOpen(false);
    navigate({
      to: "/search",
      search: normalizedKeyword ? { keyword: normalizedKeyword } : {},
    });
  };

  const openProduct = (product: Product) => {
    setIsOpen(false);
    navigate({
      to: "/product/$productId",
      params: { productId: product.id },
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitKeyword();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && canShowSuggestions && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp" && canShowSuggestions && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const activeProduct = suggestions[activeIndex];
      if (canShowSuggestions && activeProduct) {
        openProduct(activeProduct);
      } else {
        submitKeyword();
      }
    }
  };

  return (
    <form
      ref={formRef}
      className={cn("flex w-full items-center gap-2", className)}
      role="search"
      onSubmit={handleSubmit}
    >
      <div className="relative min-w-0 flex-1">
        <div className="flex h-12 items-center gap-2 rounded-full border-2 border-ocop/60 bg-white px-4 transition-colors focus-within:border-ocop dark:bg-gray-800">
          <Icon icon="mdi:magnify" className="shrink-0 text-ocop" width={20} />
          <input
            type="search"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder={t("search.placeholder")}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={canShowSuggestions}
            aria-activedescendant={
              activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
          {keyword && (
            <button
              type="button"
              aria-label={t("search.clear")}
              onClick={() => {
                setKeyword("");
                setActiveIndex(-1);
              }}
              className="shrink-0 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Icon icon="mdi:close-circle" width={18} />
            </button>
          )}
          <button
            type="button"
            aria-label={t("search.byImage")}
            className="flex shrink-0 items-center border-l border-gray-200 pl-2 text-gray-400 hover:text-ocop dark:border-gray-700"
          >
            <Icon icon="mdi:camera-outline" width={20} />
          </button>
        </div>

        {canShowSuggestions && (
          <div
            id={listboxId}
            role="listbox"
            aria-label={t("search.suggestions")}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("search.suggestions")}
            </div>

            {isSearching ? (
              <div className="flex items-center gap-2 px-4 py-5 text-sm text-gray-500">
                <Icon
                  icon="mdi:loading"
                  width={18}
                  className="animate-spin text-ocop"
                />
                {t("search.loadingSuggestions")}
              </div>
            ) : suggestions.length ? (
              <div className="max-h-[min(420px,60vh)] overflow-y-auto py-1">
                {suggestions.map((product, index) => (
                  <button
                    key={product.id}
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openProduct(product)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      index === activeIndex
                        ? "bg-ocop-light dark:bg-green-950/40"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800",
                    )}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                        {product.category} · {product.region}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ocop">
                      {formatCurrency(product.price)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5 text-sm text-gray-500">
                {t("search.noSuggestions")}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-3 text-left text-sm font-semibold text-ocop transition-colors hover:bg-ocop-light dark:border-gray-800 dark:hover:bg-green-950/30"
            >
              <span className="truncate">
                {t("search.viewAll", { keyword: normalizedKeyword })}
              </span>
              <Icon icon="mdi:arrow-right" width={18} className="shrink-0" />
            </button>
          </div>
        )}
      </div>
      {withButton && (
        <button
          type="submit"
          className="hidden h-12 shrink-0 rounded-full bg-ocop px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ocop-dark md:block"
        >
          {t("header.searchButton")}
        </button>
      )}
    </form>
  );
}
