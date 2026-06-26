import { ButtonHTMLAttributes, forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/utils";

type IconButtonVariant = "default" | "secondary" | "danger";
type IconButtonSize = "icon" | "sm" | "md";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  default: "text-gray-500 hover:text-primary",
  secondary: "text-gray-500 hover:text-secondary",
  danger: "text-gray-500 hover:text-error",
};

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  icon: "h-8 w-8",
  sm: "h-7 w-7",
  md: "h-9 w-9",
};

/** Icon-only button, primarily for table row actions. */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: IconComp, variant = "default", size = "icon", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      >
        <IconComp className="size-5" />
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton };
export type { IconButtonProps };
