import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/utils";

interface StorefrontLogoProps {
    className?: string;
    /** Render light text/icon for use on a dark (green) header. */
    onDark?: boolean;
}

export function StorefrontLogo({ className, onDark }: StorefrontLogoProps) {
    return (
        <Link to="/" className={cn("flex shrink-0 items-center gap-1.5", className)} aria-label="OCOP">
            <span
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    onDark ? "bg-white/15 text-white" : "bg-ocop-light text-ocop"
                )}
            >
                <Icon icon="mdi:sprout" width={24} />
            </span>
            <span className="flex flex-col leading-none">
                <span
                    className={cn(
                        "text-xl font-extrabold tracking-tight",
                        onDark ? "text-white" : "text-ocop"
                    )}
                >
                    OCOP
                </span>
                <span className={cn("text-[10px] font-medium", onDark ? "text-white/80" : "text-gray-500")}>
                    Tinh hoa hàng Việt
                </span>
            </span>
        </Link>
    );
}
