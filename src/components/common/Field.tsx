import { forwardRef, HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/utils";

interface FieldProps extends HTMLAttributes<HTMLDivElement> {}

/** Vertical form field container. */
function Field({ className, children, ...props }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

function FieldLabel({ className, children, required, ...props }: FieldLabelProps) {
  return (
    <label className={cn("text-foreground text-sm font-medium", className)} {...props}>
      {children}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
  );
}

interface FieldContentProps extends HTMLAttributes<HTMLDivElement> {}

const FieldContent = forwardRef<HTMLDivElement, FieldContentProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
});
FieldContent.displayName = "FieldContent";

interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

function FieldError({ className, children, ...props }: FieldErrorProps) {
  if (!children) return null;
  return (
    <p className={cn("text-error text-sm", className)} {...props}>
      {children}
    </p>
  );
}

export { Field, FieldLabel, FieldContent, FieldError };
