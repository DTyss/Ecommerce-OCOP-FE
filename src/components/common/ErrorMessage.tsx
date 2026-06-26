import { cn } from "@/utils/utils";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

/** Inline form error message. */
export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;
  return <p className={cn("text-error text-sm", className)}>{message}</p>;
}
