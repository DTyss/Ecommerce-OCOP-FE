import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/utils/utils";

const cartFlyTargetSelector = "[data-cart-fly-target='true']";

const getVisibleCartTarget = () => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(cartFlyTargetSelector));

  return targets.find((target) => {
    const rect = target.getBoundingClientRect();
    const style = window.getComputedStyle(target);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  });
};

const createFlyLayer = (source: DOMRect, imageSrc?: string) => {
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "pointer-events-none fixed z-[9999]";
  layer.style.left = `${source.left + source.width / 2 - 18}px`;
  layer.style.top = `${source.top + source.height / 2 - 18}px`;
  layer.style.width = "36px";
  layer.style.height = "36px";

  if (imageSrc) {
    const image = document.createElement("img");
    image.src = imageSrc;
    image.alt = "";
    image.className = "h-full w-full rounded-xl border border-white/80 object-cover shadow-lg";
    layer.appendChild(image);
  } else {
    layer.className = cn(layer.className, "bg-ocop flex items-center justify-center rounded-full text-white shadow-lg");
    layer.textContent = "+";
  }

  document.body.appendChild(layer);
  return layer;
};

const runFlyToCart = (sourceElement: HTMLElement, imageSrc?: string) => {
  if (typeof document === "undefined") return;

  const target = getVisibleCartTarget();
  if (!target) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const layer = createFlyLayer(sourceRect, imageSrc);
  const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
  const lift = Math.min(120, Math.max(56, Math.abs(deltaY) * 0.22));

  const animation = layer.animate(
    [
      { opacity: 0, transform: "translate3d(0, 0, 0) scale(0.62) rotate(0deg)", offset: 0 },
      { opacity: 1, transform: "translate3d(0, -14px, 0) scale(1) rotate(-4deg)", offset: 0.16 },
      {
        opacity: 1,
        transform: `translate3d(${deltaX * 0.34}px, ${deltaY * 0.34 - lift}px, 0) scale(0.92) rotate(6deg)`,
        offset: 0.48,
      },
      {
        opacity: 0.96,
        transform: `translate3d(${deltaX * 0.78}px, ${deltaY * 0.78 - lift * 0.42}px, 0) scale(0.64) rotate(-3deg)`,
        offset: 0.78,
      },
      { opacity: 0, transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.24) rotate(0deg)`, offset: 1 },
    ],
    {
      duration: 1150,
      easing: "cubic-bezier(.18,.86,.22,1)",
    },
  );

  window.setTimeout(() => {
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.16)" }, { transform: "scale(1)" }], {
      duration: 260,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });
  }, 940);

  animation.finished.finally(() => layer.remove());
};

export interface CartActionButtonProps extends ButtonProps {
  flyImageSrc?: string;
}

export const CartActionButton = React.forwardRef<HTMLButtonElement, CartActionButtonProps>(
  ({ flyImageSrc, onClick, className, children, disabled, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <Button
        ref={ref}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);

          if (!disabled && !prefersReducedMotion) {
            runFlyToCart(event.currentTarget, flyImageSrc);
          }
        }}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <motion.span
          className="flex items-center justify-center gap-1"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </Button>
    );
  },
);

CartActionButton.displayName = "CartActionButton";
