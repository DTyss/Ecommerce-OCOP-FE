import * as React from "react";
import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 dark:ring-primary-600 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent text-white bg-primary",
        primary: "border-transparent text-white bg-primary",
        secondary: "border-transparent bg-gray-100 dark:bg-gray-800 text-white",
        success: "border-transparent bg-success text-white",
        warning: "border-transparent bg-warning text-white",
        info: "border-transparent bg-info text-white",
        error: "border-transparent bg-error text-white",
        outline: "border-primary text-primary",
        outlineSecondary: "border-secondary text-secondary",
        outlineSuccess: "border-success text-success",
        outlineWarning: "border-warning text-warning",
        outlineError: "border-error text-error",
        outlineInfo: "border-info text-info",
        lightPrimary: "bg-lightprimary text-primary border-0",
        lightSecondary: "bg-lightsecondary text-secondary border-0",
        lightSuccess: "bg-lightsuccess text-success border-0",
        lightError: "bg-lighterror text-error border-0",
        lightInfo: "bg-lightinfo text-info border-0",
        lightWarning: "bg-lightwarning text-warning border-0",
        destructive: "border-transparent bg-error-500 text-white",
        gray: "border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
