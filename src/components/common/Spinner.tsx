import { cn } from "@/utils/utils";

interface SpinnerProps {
  className?: string;
  fullscreen?: boolean;
}

/** Simple loading spinner. */
export default function Spinner({ className, fullscreen = true }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", fullscreen && "min-h-screen w-full")}>
      <span
        className={cn(
          "border-primary inline-block h-8 w-8 animate-spin rounded-full border-3 border-t-transparent",
          className,
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
