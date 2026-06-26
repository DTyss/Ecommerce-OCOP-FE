import * as React from "react";
import { cn } from "@/utils/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:ring-primary-600 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const buttonVariants = cva(buttonBase, {
  variants: {
    variant: {
      // SOLID
      default: "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover",

      secondary: "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-hover",

      success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-600",

      warning: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-600",

      info: "bg-info-500 text-white hover:bg-info-600 active:bg-info-600",

      error: "bg-error-500 text-white hover:bg-error-600 active:bg-error-600",

      destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",

      // OUTLINE
      outline:
        "border border-gray-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-primary hover:text-white active:bg-primary-hover",

      outlineSecondary:
        "border border-secondary text-secondary hover:bg-secondary hover:text-white active:bg-secondary-hover",

      outlineSuccess:
        "border border-success-500 text-success-500 hover:bg-success-500 hover:text-white active:bg-success-600",

      outlineWarning:
        "border border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white active:bg-warning-600",

      outlineInfo: "border border-info-500 text-info-500 hover:bg-info-500 hover:text-white active:bg-info-600",

      outlineError: "border border-error-500 text-error-500 hover:bg-error-500 hover:text-white active:bg-error-600",

      // GHOST
      ghost:
        "hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-900 dark:text-gray-100 active:bg-gray-100 dark:bg-gray-800",

      ghostPrimary: "text-primary hover:bg-primary-50 active:bg-primary-100",

      ghostSecondary: "text-secondary hover:bg-secondary-50 active:bg-secondary-100",

      ghostSuccess: "text-success-500 hover:bg-success-50 active:bg-success-100",

      ghostWarning: "text-warning-500 hover:bg-warning-50 active:bg-warning-100",

      ghostInfo: "text-info-500 hover:bg-info-50 active:bg-info-100",

      ghostError: "text-error-500 hover:bg-error-50 active:bg-error-100",

      // LIGHT
      lightPrimary: "bg-primary-50 text-primary hover:bg-primary hover:text-white active:bg-primary-hover",

      lightSecondary: "bg-secondary-50 text-secondary hover:bg-secondary hover:text-white active:bg-secondary-hover",

      lightSuccess: "bg-success-50 text-success-600 hover:bg-success-500 hover:text-white active:bg-success-600",

      lightWarning: "bg-warning-50 text-warning-600 hover:bg-warning-500 hover:text-white active:bg-warning-600",

      lightInfo: "bg-info-50 text-info-600 hover:bg-info-500 hover:text-white active:bg-info-600",

      lightError: "bg-error-50 text-error-600 hover:bg-error-500 hover:text-white active:bg-error-600",

      // LINK
      link: "text-primary underline-offset-4 hover:underline",
    },

    size: {
      sm: "h-8 px-3",
      default: "h-9 px-2",
      lg: "h-10 px-6",
      icon: "h-9 w-9 p-0",
    },

    shape: {
      pill: "rounded-full",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, shape, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
