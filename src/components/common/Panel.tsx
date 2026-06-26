import type React from "react";
import { cn } from "@/utils/utils";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return <section className={cn("box-default", className)}>{children}</section>;
}
