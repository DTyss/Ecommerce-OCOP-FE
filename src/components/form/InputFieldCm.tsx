import * as React from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

interface InputFieldCmProps extends Omit<ComponentPropsWithoutRef<typeof Input>, "error"> {
  label?: string | React.ReactNode;
  required?: boolean;
  error?: string | undefined;
  description?: string;
}

/**
 * InputField component - combines Field + Input for reusable form fields
 * Following Figma design rules with consistent spacing and error handling
 */
const InputFieldCm = React.forwardRef<ComponentRef<typeof Input>, InputFieldCmProps>(
  ({ className, label, error, description, id, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const descriptionId = `${fieldId}-description`;

    return (
      <Field>
        {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
        <FieldContent>
          <div className="focus-within:ring-primary-300 flex h-10 items-center justify-between rounded-lg border border-gray-200 bg-white px-3 transition-all focus-within:border-transparent focus-within:ring-2">
            <Input
              ref={ref}
              id={fieldId}
              error={!!error}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : description ? descriptionId : undefined}
              className={cn("h-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", className)}
              {...props}
            />
            <span className="pl-2 text-gray-500">cm</span>
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

InputFieldCm.displayName = "InputFieldNumber";

export { InputFieldCm };
export type { InputFieldCmProps };
