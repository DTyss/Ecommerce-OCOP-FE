import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
}

/** Text input with error styling, used by form field components. */
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "border-border bg-card text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors outline-none",
        "focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-error focus:border-error",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
export type { InputProps };
