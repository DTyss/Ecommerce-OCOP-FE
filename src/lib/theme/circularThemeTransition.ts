import type { MouseEvent } from "react";
import type { Theme } from "@/components/provider/ThemeProvider";

type ViewTransition = {
    ready: Promise<void>;
};

type ViewTransitionDocument = Document & {
    startViewTransition?: (updateCallback: () => void) => ViewTransition;
};

type ToggleThemeOptions = {
    event: MouseEvent<HTMLElement>;
    nextTheme: Exclude<Theme, "system">;
    setTheme: (theme: Theme) => void;
};

const TRANSITION_DURATION_MS = 450;
const TRANSITION_EASING = "ease-in-out";
const EXPAND_TRANSITION_CLASS = "theme-transition-expand";
const CONTRACT_TRANSITION_CLASS = "theme-transition-contract";

export function getResolvedTheme(theme: Theme) {
    if (typeof window === "undefined") {
        return theme === "dark" ? "dark" : "light";
    }

    if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    return theme;
}

export function toggleThemeWithCircularReveal({
    event,
    nextTheme,
    setTheme,
}: ToggleThemeOptions) {
    const { clientX, clientY } = event;
    const transitionDocument = document as ViewTransitionDocument;

    if (
        !transitionDocument.startViewTransition ||
        !document.documentElement.animate ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        setTheme(nextTheme);
        return;
    }

    const endRadius = Math.hypot(
        Math.max(clientX, window.innerWidth - clientX),
        Math.max(clientY, window.innerHeight - clientY),
    );
    const isExpandingToLight = nextTheme === "light";
    const transitionClass = isExpandingToLight
        ? EXPAND_TRANSITION_CLASS
        : CONTRACT_TRANSITION_CLASS;
    const animatedPseudoElement = isExpandingToLight
        ? "::view-transition-new(root)"
        : "::view-transition-old(root)";
    const clipPathKeyframes = isExpandingToLight
        ? [
              `circle(0px at ${clientX}px ${clientY}px)`,
              `circle(${endRadius}px at ${clientX}px ${clientY}px)`,
          ]
        : [
              `circle(${endRadius}px at ${clientX}px ${clientY}px)`,
              `circle(0px at ${clientX}px ${clientY}px)`,
          ];

    document.documentElement.classList.remove(
        EXPAND_TRANSITION_CLASS,
        CONTRACT_TRANSITION_CLASS,
    );
    document.documentElement.classList.add(transitionClass);

    const transition = transitionDocument.startViewTransition(() => {
        setTheme(nextTheme);
    });

    transition.ready
        .then(() => {
            document.documentElement.animate(
                {
                    clipPath: clipPathKeyframes,
                },
                {
                    duration: TRANSITION_DURATION_MS,
                    easing: TRANSITION_EASING,
                    fill: "both",
                    pseudoElement: animatedPseudoElement,
                },
            ).finished.finally(() => {
                document.documentElement.classList.remove(transitionClass);
            });
        })
        .catch(() => {
            document.documentElement.classList.remove(transitionClass);
            setTheme(nextTheme);
        });
}
