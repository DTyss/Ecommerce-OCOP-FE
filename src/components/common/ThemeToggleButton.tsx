import { Icon } from "@iconify/react";
import { useTheme } from "@/components/provider/ThemeProvider";
import { getResolvedTheme, toggleThemeWithCircularReveal } from "@/lib/theme/circularThemeTransition";
import { cn } from "@/utils/utils";

type ThemeToggleButtonProps = {
  className?: string;
  iconClassName?: string;
  compact?: boolean;
};

export function ThemeToggleButton({ className, iconClassName, compact = false }: ThemeToggleButtonProps) {
  const { theme, setTheme } = useTheme();
  const resolvedTheme = getResolvedTheme(theme);
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "hover:text-primary dark:hover:text-primary text-link dark:text-darklink group relative flex items-center justify-center rounded-full focus:ring-0 focus:outline-none",
        compact ? "px-1 sm:px-15" : "px-15",
        className,
      )}
      onClick={(event) => {
        toggleThemeWithCircularReveal({
          event,
          nextTheme,
          setTheme,
        });
      }}
    >
      <span className="group-hover:after:bg-lightprimary relative flex items-center justify-center after:absolute after:-top-1/2 after:h-10 after:w-10 after:rounded-full">
        <Icon
          icon={isDark ? "solar:sun-bold-duotone" : "tabler:moon"}
          width="20"
          className={cn("group-hover:text-primary", iconClassName)}
        />
      </span>
    </button>
  );
}
