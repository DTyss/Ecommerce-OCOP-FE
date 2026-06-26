import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/utils/utils";

interface FavoriteButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> {
  active: boolean;
  iconClassName?: string;
}

const MotionHeart = motion.create(Heart);

export const FavoriteButton = React.forwardRef<HTMLButtonElement, FavoriteButtonProps>(
  ({ active, className, iconClassName, children, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        type="button"
        whileTap={prefersReducedMotion ? undefined : { scale: 0.88 }}
        animate={prefersReducedMotion ? undefined : { scale: active ? [1, 1.18, 1] : 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={cn("relative overflow-hidden", active ? "text-ocop-red" : "text-gray-400", className)}
        {...props}
      >
        {!prefersReducedMotion && active && (
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0.28 }}
            animate={{ scale: 1.85, opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="bg-ocop-red/20 pointer-events-none absolute inset-1 rounded-full"
          />
        )}
        <MotionHeart
          aria-hidden="true"
          className={cn("relative z-10 h-5 w-5", iconClassName)}
          fill={active ? "currentColor" : "none"}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  scale: active ? [0.82, 1.18, 1] : 1,
                  rotate: active ? [0, -8, 5, 0] : 0,
                }
          }
          transition={{ duration: 0.32, ease: "easeOut" }}
        />
        {children}
      </motion.button>
    );
  },
);

FavoriteButton.displayName = "FavoriteButton";
