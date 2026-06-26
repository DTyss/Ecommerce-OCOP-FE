import { useState, useRef, useEffect } from "react";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Field, FieldContent, FieldLabel } from "@/components/common/Field";
import { Input } from "@/components/common/Input";
import { Typography } from "@/components/ui/typography";

interface SuggestionOption {
  value: string;
  label: string;
}

interface SuggestionFieldProps {
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: SuggestionOption[];
  error?: string | undefined;
  className?: string;
  fieldId?: string;
  required?: boolean;
}

export function SuggestionField({
  label,
  placeholder,
  value = "",
  onChange,
  options = [],
  error,
  className = "",
  fieldId,
  required = false,
}: SuggestionFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<SuggestionOption[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(value.toLowerCase()) ||
          option.value.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SuggestionOption) => {
    onChange?.(option.value);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
      )}
      <FieldContent className="relative" ref={containerRef}>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          error={!!error}
        />

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <ul className="max-h-60 overflow-auto rounded-md py-1">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  <Typography.Small>{option.label}</Typography.Small>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isOpen && filteredOptions.length === 0 && value && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-2">
              <Typography.Muted>Không tìm thấy gợi ý</Typography.Muted>
            </div>
          </div>
        )}
      </FieldContent>

      {error && <ErrorMessage message={error} />}
    </Field>
  );
}
