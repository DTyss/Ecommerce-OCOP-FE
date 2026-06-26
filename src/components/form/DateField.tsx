import React from "react";
import { DatePicker } from "@/components/common/DatePicker";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/common/Field";

interface DateFieldProps extends Omit<React.ComponentPropsWithoutRef<typeof DatePicker>, "error"> {
  label?: string;
  required?: boolean;
  error?: string | undefined;
  description?: string;
  id?: string;
  groupClassName?: string;
}

/**
 * DateField component - combines Field + DatePicker for reusable form fields
 * Following Figma design rules with consistent spacing and error handling
 */
function DateField({ className, groupClassName, label, required, error, description, id, ...props }: DateFieldProps) {
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
        <DatePicker
          aria-invalid={!!error}
          aria-describedby={error ? errorId : description ? descriptionId : undefined}
          className={className ?? ""}
          {...props}
        />
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

DateField.displayName = "DateField";

export { DateField };
export type { DateFieldProps };
