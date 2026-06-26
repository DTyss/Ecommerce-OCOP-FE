import { ReactNode, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

interface ScrollToTopProps {
  children?: ReactNode;
}

/** Scrolls the window to the top whenever the route pathname changes. */
export default function ScrollToTop({ children }: ScrollToTopProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
