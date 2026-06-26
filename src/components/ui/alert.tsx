import * as React from "react";
import { cn } from "@/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-lg  p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-900 dark:text-gray-100",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
        primary: "bg-primary text-white",
        secondary: "bg-gray-100 dark:bg-gray-800 text-white",
        success: "bg-success text-white",
        error: "bg-error text-white",
        warning: "bg-warning text-white",
        info: "bg-info text-white",
        lightPrimary: "bg-lightprimary text-primary [&>svg]:text-primary",
        lightSecondary: "bg-lightsecondary text-secondary [&>svg]:text-secondary",
        lightSuccess: "bg-lightsuccess text-success [&>svg]:text-success",
        lightWarning: "bg-lightwarning text-warning [&>svg]:text-warning",
        lightError: "bg-lighterror text-error [&>svg]:text-error",
        lightInfo: "bg-lightinfo text-info [&>svg]:text-info",
        destructive:
          "border border-error-500/50 text-error-500 dark:border-error-500/50 dark:text-error-400 [&>svg]:text-error-500 dark:[&>svg]:text-error-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 leading-none font-medium tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
