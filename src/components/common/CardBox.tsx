import { HTMLAttributes } from "react";
import { cn } from "@/utils/utils";

interface CardBoxProps extends HTMLAttributes<HTMLDivElement> {}

/** Generic rounded card container used across the app. */
export default function CardBox({ className, children, ...props }: CardBoxProps) {
  return (
    <div
      className={cn("bg-card text-card-foreground rounded-tw border-border border p-6 shadow-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}
