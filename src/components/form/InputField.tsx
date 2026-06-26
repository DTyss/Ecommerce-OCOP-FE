import * as React from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps extends Omit<ComponentPropsWithoutRef<typeof Input>, "error"> {
  label?: string | React.ReactNode;
  required: boolean;
  error?: string | undefined;
  description?: string;
  groupClassName?: string;
}

/**
 * InputField component - combines Field + Input for reusable form fields
 * Following Figma design rules with consistent spacing and error handling
 */
const InputField = React.forwardRef<ComponentRef<typeof Input>, InputFieldProps>(
  ({ className, label, required, error, description, id, groupClassName, autoComplete = "off", ...props }, ref) => {
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
          <Input
            ref={ref}
            id={fieldId}
            error={!!error}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            className={className}
            autoComplete={autoComplete}
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
  },
);

InputField.displayName = "InputField";

export { InputField };
export type { InputFieldProps };
