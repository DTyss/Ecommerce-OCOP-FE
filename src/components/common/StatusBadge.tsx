import { cn } from "@/utils/utils";

const WARNING_STATUSES = new Set(["pending", "open", "created", "remove_orders_pending", "at_hub", "delayed"]);
const INFO_STATUSES = new Set([
  "batched",
  "shipping",
  "merged",
  "in_progress",
  "assigned",
  "arrived_at_shop",
  "in_transit",
]);
const SUCCESS_STATUSES = new Set([
  "delivered",
  "picked",
  "picked_up",
  "confirmed_pickup",
  "success",
  "active",
  "completed",
  "resolved",
]);
const ERROR_STATUSES = new Set(["cancelled", "returned", "failed", "inactive", "pending_deletion", "closed"]);

function getStatusConfig(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (WARNING_STATUSES.has(normalizedStatus)) {
    return { bg: "bg-warning-50 dark:bg-warning-900/30", text: "text-warning-600 dark:text-warning-400" };
  }
  if (INFO_STATUSES.has(normalizedStatus)) {
    return { bg: "bg-info-50 dark:bg-info-900/30", text: "text-info-600 dark:text-info-400" };
  }
  if (SUCCESS_STATUSES.has(normalizedStatus)) {
    return { bg: "bg-success-50 dark:bg-success-900/30", text: "text-success-600 dark:text-success-400" };
  }
  if (ERROR_STATUSES.has(normalizedStatus)) {
    return { bg: "bg-error-50 dark:bg-error-900/30", text: "text-error-600 dark:text-error-400" };
  }

  return { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" };
}

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const displayText = label ?? formatStatusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium",
        config.bg,
        config.text,
        className,
      )}
    >
      {displayText}
    </span>
  );
}

export { StatusBadge };
