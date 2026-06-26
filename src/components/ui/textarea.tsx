import * as React from "react";
import { cn } from "@/utils/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus-visible:border-primary aria-invalid:ring-error-500/20 dark:aria-invalid:ring-error-500/40 aria-invalid:border-error-500 dark:border-error-500 dark:bg-input/30 mt-2 flex field-sizing-content min-h-16 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-gray-500 focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-600 dark:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
