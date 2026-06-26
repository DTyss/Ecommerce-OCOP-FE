import { HTMLAttributes } from "react";
import { cn } from "@/utils/utils";

type Props = HTMLAttributes<HTMLElement>;

const H1 = ({ className, ...p }: Props) => (
  <h1 className={cn("text-foreground text-3xl font-bold tracking-tight", className)} {...p} />
);
const H2 = ({ className, ...p }: Props) => (
  <h2 className={cn("text-foreground text-2xl font-semibold tracking-tight", className)} {...p} />
);
const H3 = ({ className, ...p }: Props) => (
  <h3 className={cn("text-foreground text-xl font-semibold", className)} {...p} />
);
const H4 = ({ className, ...p }: Props) => (
  <h4 className={cn("text-foreground text-lg font-semibold", className)} {...p} />
);
const P = ({ className, ...p }: Props) => <p className={cn("text-foreground text-sm", className)} {...p} />;
const Lead = ({ className, ...p }: Props) => <p className={cn("text-muted-foreground text-lg", className)} {...p} />;
const Large = ({ className, ...p }: Props) => <div className={cn("text-base font-semibold", className)} {...p} />;
const Small = ({ className, ...p }: Props) => <small className={cn("text-sm font-medium", className)} {...p} />;
const Muted = ({ className, ...p }: Props) => <p className={cn("text-muted-foreground text-sm", className)} {...p} />;

/** Typography helpers, e.g. <Typography.Small />, <Typography.Muted />. */
export const Typography = { H1, H2, H3, H4, P, Lead, Large, Small, Muted };
