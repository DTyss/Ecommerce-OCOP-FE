import * as React from "react";
import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputBase =
  "flex h-9 w-full rounded-lg border px-3 py-2 text-sm file:mr-5 file:rounded-sm file:border-0 file:text-sm file:font-medium file:text-primary focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-50";

const inputVariants = cva(inputBase, {
  variants: {
    variant: {
      default:
        "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary-300",
      gray: "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 focus-visible:ring",
      info: "border-info bg-info/10 text-info placeholder-info focus:border-info focus:ring-info dark:border-info dark:bg-info/10 dark:focus:border-info dark:focus:ring-border-info focus-visible:ring",
      failure:
        "border-error bg-error/10 text-error placeholder-error focus:border-error focus:ring-error dark:border-error dark:bg-error/10 dark:focus:border-error dark:focus:ring-error focus-visible:ring",
      warning:
        "border-warning bg-warning/10 text-warning placeholder-warning focus:border-warning focus:ring-warning dark:border-warning dark:bg-warning/10 dark:focus:border-warning dark:focus:ring-warning focus-visible:ring",
      success:
        "border-success bg-success/10 text-success placeholder-success focus:border-success focus:ring-success dark:border-success dark:bg-success/10 dark:focus:border-green-500 dark:focus:ring-green-500 focus-visible:ring",
      filter:
        "h-10 rounded-xl border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 transition-all focus:border-transparent focus:ring-2 focus:ring-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:border-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant }),
          error &&
            "border-error-500 focus:border-error-500 focus:ring-error-500 focus-visible:border-error-500 focus-visible:ring-error-500",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
export type InputVariant = VariantProps<typeof inputVariants>["variant"];
