import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";
import { ChevronDown, X } from "lucide-react";

/** Option shape for dropdown: name + code (number for Province/Ward, string for e.g. vietmap ref_id) */
export interface AutoCompleteOption {
  name: string;
  code: string | number;
}

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;

  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);
  const index = normalizedText.indexOf(normalizedSearch);

  if (index === -1) return text;

  // Find the actual position in original text (accounting for diacritics)
  let actualIndex = 0;
  let normalizedIndex = 0;

  while (normalizedIndex < index && actualIndex < text.length) {
    if (normalizeText(text[actualIndex] ?? "") === (normalizedText[normalizedIndex] ?? "")) {
      normalizedIndex++;
    }
    actualIndex++;
  }

  const beforeMatch = text.slice(0, actualIndex);
  const match = text.slice(actualIndex, actualIndex + searchTerm.length);
  const afterMatch = text.slice(actualIndex + searchTerm.length);

  return (
    <>
      {beforeMatch}
      <mark className="bg-yellow-200 text-yellow-900">{match}</mark>
      {afterMatch}
    </>
  );
};

interface AutoCompleteSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string, selectedItem?: AutoCompleteOption) => void;
  onBlur: () => void;
  placeholder: string;
  options: AutoCompleteOption[];
  className?: string;
  disabled?: boolean;
  error?: boolean;
  showClearButton?: boolean;
}

export const AutoCompleteSelect: React.FC<AutoCompleteSelectProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  options,
  className,
  disabled = false,
  error = false,
  showClearButton: showClearButtonProp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 240 });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const dropdownId = id ?? name ?? generatedId;

  useEffect(() => {
    if (!isOpen) {
      setInputValue(value || "");
    }
  }, [value, isOpen]);

  // Filter options based on search term (support both with and without diacritics)
  const filteredOptions = useMemo(() => {
    const normalizedSearchTerm = normalizeText(searchTerm);
    return options.filter((option) => normalizeText(option.name).includes(normalizedSearchTerm));
  }, [options, searchTerm]);

  useEffect(() => {
    if (options.length > 0 && searchTerm && filteredOptions.length === 0) {
      setSearchTerm("");
    }
  }, [options.length, searchTerm, filteredOptions.length]);

  useEffect(() => {
    if (options.length > 0 && !disabled && inputRef.current === document.activeElement) {
      setIsOpen(true);
    }
  }, [options.length, disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionSelect = (option: AutoCompleteOption) => {
    setInputValue(option.name);
    onChange(option.name, option);
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle clear
  const handleClear = () => {
    setInputValue("");
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  // Find dialog container for portal
  const getDialogContainer = () => {
    const dialogContent = inputRef.current?.closest('[data-slot="dialog-content"]');
    return (dialogContent as HTMLElement) || document.body;
  };

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const dialogContainer = getDialogContainer();
      const isInDialog = dialogContainer !== document.body;

      if (isInDialog) {
        const dialogRect = dialogContainer.getBoundingClientRect();
        const relativeTop = rect.bottom - dialogRect.top + dialogContainer.scrollTop;
        const relativeLeft = rect.left - dialogRect.left;
        const availableSpace = dialogRect.height - (relativeTop - dialogContainer.scrollTop) - 8;
        const maxHeight = Math.min(240, Math.max(120, availableSpace));
        setDropdownPosition({
          top: relativeTop,
          left: relativeLeft,
          width: rect.width,
          maxHeight,
        });
      } else {
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
          maxHeight: 240,
        });
      }
    }
  }, [isOpen]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const dialogContainer = getDialogContainer();
        const isInDialog = dialogContainer !== document.body;

        if (isInDialog) {
          const dialogRect = dialogContainer.getBoundingClientRect();
          const relativeTop = rect.bottom - dialogRect.top + dialogContainer.scrollTop;
          const relativeLeft = rect.left - dialogRect.left;
          const availableSpace = dialogRect.height - (relativeTop - dialogContainer.scrollTop) - 8;
          const maxHeight = Math.min(240, Math.max(120, availableSpace));
          setDropdownPosition({
            top: relativeTop,
            left: relativeLeft,
            width: rect.width,
            maxHeight,
          });
        } else {
          setDropdownPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: rect.width,
            maxHeight: 240,
          });
        }
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownElement = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);
      const isClickInsideInput = inputRef.current?.contains(target);
      const isClickInsideDropdown = dropdownElement?.contains(target);

      if (!isClickInsideInput && !isClickInsideDropdown) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        onBlur();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [isOpen, onBlur, dropdownId]);

  const displayValue = inputValue;
  const showClearButton = showClearButtonProp ?? Boolean(displayValue && !disabled);

  return (
    <div className={cn("relative", disabled && "cursor-not-allowed", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          className={disabled ? "cursor-not-allowed bg-gray-50" : ""}
          autoComplete="off"
        />

        <div className={cn("absolute inset-y-0 right-0 flex items-center pr-2", disabled && "pointer-events-none")}>
          {showClearButton && (
            <button type="button" onClick={handleClear} className="mr-1 rounded-full p-1 hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              disabled && "text-gray-300",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {isOpen &&
        filteredOptions.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            data-dropdown-id={dropdownId}
            className={cn(
              "overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900",
              getDialogContainer() !== document.body ? "absolute z-9999" : "fixed z-9999",
            )}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: `${dropdownPosition.maxHeight}px`,
              pointerEvents: "auto",
              overscrollBehavior: "contain",
            }}
            onWheel={(e) => {
              // Allow scrolling within dropdown
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Prevent closing dropdown when clicking inside
              e.stopPropagation();
            }}
          >
            <ul ref={listRef} className="py-1" role="listbox" aria-label={placeholder}>
              {filteredOptions.map((option, index) => (
                <li
                  key={option.code}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionSelect(option);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionSelect(option);
                  }}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
                    index === highlightedIndex && "bg-gray-100 dark:bg-gray-800",
                  )}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  <div className="flex items-center justify-between">
                    <span>{highlightMatch(option.name, searchTerm)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>,
          getDialogContainer(),
        )}

      {isOpen &&
        filteredOptions.length === 0 &&
        searchTerm &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-dropdown-id={dropdownId}
            className={cn(
              "rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900",
              getDialogContainer() !== document.body ? "absolute z-9999" : "fixed z-9999",
            )}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              pointerEvents: "auto",
            }}
          >
            <div className="px-3 py-2 text-sm text-gray-500">No results found for "{searchTerm}"</div>
          </div>,
          getDialogContainer(),
        )}
    </div>
  );
};
