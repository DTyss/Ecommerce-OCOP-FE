import * as React from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

interface InputFieldNumberProps extends Omit<ComponentPropsWithoutRef<typeof Input>, "error"> {
  label?: string | React.ReactNode;
  required?: boolean;
  error?: string | undefined;
  description?: string;
  unit?: string;
}

/**
 * InputField component - combines Field + Input for reusable form fields
 * Following Figma design rules with consistent spacing and error handling
 */
const InputFieldNumber = React.forwardRef<ComponentRef<typeof Input>, InputFieldNumberProps>(
  ({ className, label, required, error, description, id, unit, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const descriptionId = `${fieldId}-description`;

    return (
      <Field>
        {label && (
          <FieldLabel htmlFor={fieldId} required={!!required}>
            {label}
          </FieldLabel>
        )}
        <FieldContent>
          <div className="focus-within:ring-primary-300 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 transition-all focus-within:border-transparent focus-within:ring-2">
            <Input
              ref={ref}
              id={fieldId}
              error={!!error}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : description ? descriptionId : undefined}
              className={cn("border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", className)}
              {...props}
            />
            <span className="pl-2 text-gray-500">{unit}</span>
          </div>
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

InputFieldNumber.displayName = "InputFieldNumber";

export { InputFieldNumber };
export type { InputFieldNumberProps };
