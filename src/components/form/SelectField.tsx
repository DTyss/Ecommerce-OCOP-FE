import * as React from "react";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectTriggerProps,
} from "@/components/ui/select";

type SelectVariant = SelectTriggerProps["variant"];
type SelectSize = SelectTriggerProps["size"];

interface SelectFieldProps extends Omit<React.ComponentPropsWithoutRef<typeof Select>, "error"> {
  label?: string | React.ReactNode;
  required?: boolean;
  error?: string | undefined;
  description?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  id?: string;
  className?: string;
  groupClassName?: string;
  onOpenChange?: (open: boolean) => void;
  /** Visual variant – same options as SelectTrigger: "default" | "gray" | "filter" | "info" | "failure" | "warning" | "success" */
  variant?: SelectVariant;
  /** Size variant – same options as SelectTrigger: "sm" | "default" | "lg" */
  size?: SelectSize;
}

/**
 * SelectField component - combines Field + Select for reusable form fields
 * Following Figma design rules with consistent spacing and error handling
 */
function SelectField({
  label,
  required,
  error,
  description,
  placeholder,
  options,
  id,
  className,
  groupClassName,
  onOpenChange,
  variant,
  size,
  ...props
}: SelectFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <Field className={groupClassName}>
      {label && (
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
      )}
      <FieldContent>
        <Select
          aria-invalid={!!error}
          aria-describedby={error ? errorId : description ? descriptionId : undefined}
          {...(onOpenChange && { onOpenChange })}
          {...props}
        >
          <SelectTrigger
            id={fieldId}
            variant={error ? "failure" : (variant ?? "default")}
            size={size}
            className={className}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                {...(option.disabled && { disabled: option.disabled })}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && !error && (
          <p id={descriptionId} className="text-sm text-gray-500">
            {description}
          </p>
        )}
        {error && <FieldError id={errorId}>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}

export { SelectField };
export type { SelectFieldProps };
