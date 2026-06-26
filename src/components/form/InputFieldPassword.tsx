import * as React from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldPasswordProps extends Omit<ComponentPropsWithoutRef<typeof Input>, "error" | "type"> {
  label?: string;
  required: boolean;
  error?: string | undefined;
  description?: string;
  setShowPassword?: (show: boolean) => void | undefined;
  showPassword?: boolean;
}

/**
 * InputField component - combines Field + Input for reusable form fields
 * Following Figma design rules with consistent spacing and error handling
 */
const InputFieldPassword = React.forwardRef<ComponentRef<typeof Input>, InputFieldPasswordProps>(
  ({ className, label, required, error, description, id, setShowPassword, showPassword, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const descriptionId = `${fieldId}-description`;

    return (
      <Field>
        {label && (
          <FieldLabel htmlFor={fieldId} required={required}>
            {label}
          </FieldLabel>
        )}
        <FieldContent>
          <div className="relative">
            <Input
              ref={ref}
              id={fieldId}
              type={showPassword ? "text" : "password"}
              error={!!error}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : description ? descriptionId : undefined}
              className={className}
              {...props}
            />
            <button
              type="button"
              className="focus-visible:ring-primary-300 absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-gray-400 transition-colors hover:text-gray-600 focus-visible:ring-2 focus-visible:outline-none dark:text-gray-500 dark:hover:text-gray-300"
              onClick={() => setShowPassword?.(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
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

InputFieldPassword.displayName = "InputFieldPassword";

export { InputFieldPassword };
export type { InputFieldPasswordProps };
