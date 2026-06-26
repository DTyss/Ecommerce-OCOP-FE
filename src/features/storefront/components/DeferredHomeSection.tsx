import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface DeferredHomeSectionProps {
  children: ReactNode;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
}

export function DeferredHomeSection({
  children,
  className,
  placeholderClassName = "min-h-[360px]",
  rootMargin = "420px",
}: DeferredHomeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    const section = sectionRef.current;

    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={sectionRef} className={className}>
      {shouldRender ? children : <div aria-hidden="true" className={placeholderClassName} />}
    </div>
  );
}
