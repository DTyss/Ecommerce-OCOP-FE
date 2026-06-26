import type { User } from "@/features/account/types/account";
import { cn } from "@/utils/utils";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-12 w-12 text-base",
};

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return (parts[0] ?? "?").slice(0, 2).toUpperCase();
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName}
        className={cn("rounded-full object-cover", sizeClass[size], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "bg-ocop flex items-center justify-center rounded-full font-semibold text-white",
        sizeClass[size],
        className,
      )}
    >
      {getInitials(user.fullName)}
    </span>
  );
}
