import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { useRegions } from "@/features/catalog/hooks/useCatalog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/utils";

const regionSlugAliases: Record<string, string> = {
  dbsh: "dong-bang-song-hong",
  dbscl: "dong-bang-cuu-long",
};

const regionIllustrationAliases: Record<string, string> = {
  dbsh: "dong-bang-song-hong",
  dbscl: "dong-bang-cuu-long",
};

const regionMarkerImage = "/images/regions/markers/region-star.svg";
const regionSectionBackgroundImage = "/images/background/footer-landscape-bg-optimized.jpg";

const regionCardLinkClass =
  "group block h-[224px] w-[166px] shrink-0 snap-start rounded-2xl outline-none sm:w-[176px] lg:w-[184px]";

const regionCardClass =
  "storefront-visual-card relative isolate flex h-full w-full flex-col items-center overflow-hidden rounded-2xl border border-ocop-200/80 bg-white/96 px-4 pt-5 text-center shadow-none outline outline-1 outline-ocop-50/80 ring-1 ring-ocop/10 transition-[transform,box-shadow,border-color,background-color,outline-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:-translate-y-2 group-hover:border-ocop-400 group-hover:bg-white group-hover:shadow-[0_20px_42px_-16px_rgba(11,107,58,0.34)] group-hover:outline-ocop-300/80 group-hover:ring-ocop/24 group-focus-visible:-translate-y-2 group-focus-visible:border-ocop-500 group-focus-visible:shadow-[0_20px_42px_-16px_rgba(11,107,58,0.34)] group-focus-visible:outline-2 group-focus-visible:outline-ocop-500 dark:border-ocop-400/22 dark:bg-gray-900/94 dark:outline-white/12 dark:ring-white/10 dark:group-hover:border-ocop-400/70 dark:group-hover:bg-gray-900 dark:group-hover:shadow-[0_20px_42px_-16px_rgba(0,0,0,0.60)] dark:group-hover:outline-white/24";

const regionSkeletonCardClass =
  "flex h-[224px] w-[166px] shrink-0 flex-col items-center rounded-2xl border border-ocop-200/80 bg-white/98 px-4 pt-5 ring-1 ring-ocop/10 outline outline-1 outline-ocop-50/80 sm:w-[176px] lg:w-[184px] dark:border-ocop-400/22 dark:bg-gray-900/96 dark:ring-white/10 dark:outline-white/12";

const regionTitleMistClass =
  "pointer-events-none absolute inset-x-4 top-[76px] h-[58px] rounded-xl bg-white/72 shadow-[0_8px_24px_rgba(255,255,255,0.42)] backdrop-blur-[1.5px] transition-colors duration-700 group-hover:bg-white/58 dark:hidden";

const getRegionIllustration = (regionId: string) => {
  const illustrationName = regionIllustrationAliases[regionId] ?? regionId;
  return `/images/regions/illustrations/${illustrationName}.webp`;
};

export function RegionScroller() {
  const { t } = useTranslation("storefront");
  const { data: regions, isLoading } = useRegions();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollState, setScrollState] = useState({ activeIndex: 0, maxIndex: 0, step: 1 });
  const regionCards = useMemo(() => regions?.filter((region) => region.id !== "all") ?? [], [regions]);

  const updateScrollState = useCallback(() => {
    const scroller = scrollRef.current;
    const firstCard = scroller?.querySelector("a");
    const secondCard = firstCard?.nextElementSibling;

    if (!scroller || !(firstCard instanceof HTMLElement)) {
      setScrollState({ activeIndex: 0, maxIndex: 0, step: 1 });
      return;
    }

    const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0);
    const cardStep =
      secondCard instanceof HTMLElement ? secondCard.offsetLeft - firstCard.offsetLeft : firstCard.offsetWidth;
    const step = Math.max(cardStep, 1);
    const maxIndex = Math.ceil(maxScroll / step);
    const activeIndex = scroller.scrollLeft >= maxScroll - 2 ? maxIndex : Math.round(scroller.scrollLeft / step);

    setScrollState({ activeIndex: Math.min(activeIndex, maxIndex), maxIndex, step });
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const scroller = scrollRef.current;

      if (!scroller) {
        return;
      }

      const nextIndex = Math.min(Math.max(index, 0), scrollState.maxIndex);
      const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0);

      scroller.scrollTo({
        left: nextIndex === scrollState.maxIndex ? maxScroll : nextIndex * scrollState.step,
        behavior: "smooth",
      });
      setScrollState((current) => ({ ...current, activeIndex: nextIndex }));
    },
    [scrollState.maxIndex, scrollState.step],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollState);
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, regionCards.length, updateScrollState]);

  return (
    <section className="ocop-gradient-border bg-ocop-50/40 relative overflow-visible rounded-2xl p-5 sm:p-7 dark:bg-gray-900">
      <img
        src={regionSectionBackgroundImage}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover object-right opacity-46 contrast-105 saturate-105 dark:opacity-24"
      />
      <div className="dark:backdrop-blur-0 bg-ocop-50/18 pointer-events-none absolute inset-0 rounded-2xl backdrop-blur-[0.35px] dark:bg-gray-900/60" />
      <div className="from-ocop-50/82 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r via-white/34 to-white/10 dark:from-gray-950/90 dark:via-gray-950/62 dark:to-gray-950/30" />
      <div className="from-ocop-100/38 via-ocop-amber/10 pointer-events-none absolute top-0 left-0 h-48 w-[78%] rounded-full bg-gradient-to-r to-transparent blur-3xl dark:hidden" />
      <div className="bg-ocop-amber/16 dark:bg-ocop-amber/10 pointer-events-none absolute top-0 right-0 h-36 w-52 rounded-full blur-3xl" />
      <div className="bg-ocop-gold/10 dark:bg-ocop-gold/8 pointer-events-none absolute right-0 bottom-0 h-24 w-[58%] rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-ocop text-2xl leading-tight font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.78)] sm:text-[30px] dark:drop-shadow-none">
              {t("region.title")}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base dark:text-gray-400">
              {t("region.subtitle")}
            </p>
          </div>
          <Link
            to="/regions"
            className="text-ocop hover:text-ocop-dark hidden shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors sm:flex"
          >
            {t("region.viewAll")}
            <Icon icon="mdi:chevron-right" width={20} />
          </Link>
        </div>
      </div>

      <div className="relative mt-6 sm:mt-8">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] items-stretch gap-4 overflow-x-auto px-4 pt-5 pr-14 pb-8 sm:pr-16 [&::-webkit-scrollbar]:hidden"
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={regionSkeletonCardClass}>
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="mt-4 h-5 w-24" />
                  <Skeleton className="mt-auto h-16 w-full rounded-xl" />
                </div>
              ))
            : regionCards.map((region) => {
                const regionSlug = regionSlugAliases[region.id] ?? region.id;

                return (
                  <Link
                    key={region.id}
                    to="/regions/$regionSlug"
                    params={{ regionSlug }}
                    className={regionCardLinkClass}
                  >
                    <div className={regionCardClass}>
                      <img
                        src={getRegionIllustration(region.id)}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        loading="lazy"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90 contrast-110 saturate-125 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 dark:opacity-60 dark:contrast-125 dark:group-hover:opacity-90"
                      />
                      <span className="to-ocop-50/24 group-hover:to-ocop-50/10 pointer-events-none absolute inset-0 bg-gradient-to-b from-white/38 via-white/12 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:from-white/24 group-hover:via-white/8 dark:from-gray-950/60 dark:via-gray-950/34 dark:to-gray-950/48 dark:group-hover:from-gray-950/46 dark:group-hover:via-gray-950/24 dark:group-hover:to-gray-950/36" />
                      <span className={regionTitleMistClass} />
                      <span className="relative z-10 flex w-full flex-col items-center gap-2">
                        <span className="group-hover:ring-ocop/34 ring-ocop-50 h-12 w-12 overflow-hidden rounded-full bg-white/96 p-1 shadow-[0_4px_16px_rgba(11,107,58,0.14)] ring-2 transition-all dark:bg-gray-950/90 dark:ring-gray-800">
                          <img
                            src={regionMarkerImage}
                            alt={region.name}
                            decoding="async"
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                          />
                        </span>
                        <span className="flex h-[52px] items-center justify-center">
                          <span className="group-hover:text-ocop line-clamp-2 text-base leading-snug font-bold text-gray-950 transition-colors dark:text-gray-50">
                            {region.name}
                          </span>
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}

          {!isLoading && (
            <Link to="/regions" className={regionCardLinkClass}>
              <div className={regionCardClass}>
                <img
                  src="/images/regions/illustrations/kham-pha-vung-mien.webp"
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-88 contrast-110 saturate-125 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 dark:opacity-60 dark:contrast-125 dark:group-hover:opacity-86"
                />
                <span className="to-ocop-50/24 group-hover:to-ocop-50/10 pointer-events-none absolute inset-0 bg-gradient-to-b from-white/38 via-white/12 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:from-white/24 group-hover:via-white/8 dark:from-gray-950/60 dark:via-gray-950/34 dark:to-gray-950/48 dark:group-hover:from-gray-950/46 dark:group-hover:via-gray-950/24 dark:group-hover:to-gray-950/36" />
                <span className={regionTitleMistClass} />
                <span className="relative z-10 flex w-full flex-col items-center gap-2">
                  <span className="bg-ocop-50 text-ocop group-hover:bg-ocop flex h-12 w-12 items-center justify-center rounded-full shadow-[0_4px_16px_rgba(11,107,58,0.14)] transition-colors group-hover:text-white dark:bg-gray-950">
                    <Icon icon="mdi:map-search-outline" width={26} />
                  </span>
                  <span className="flex h-[52px] items-center justify-center">
                    <span className="group-hover:text-ocop line-clamp-2 text-base leading-snug font-bold text-gray-950 transition-colors dark:text-gray-50">
                      {t("region.exploreAll")}
                    </span>
                  </span>
                </span>
                <span className="text-ocop border-ocop/15 group-hover:bg-ocop absolute bottom-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors group-hover:text-white dark:border-gray-700 dark:bg-gray-950">
                  <Icon icon="mdi:chevron-right" width={24} />
                </span>
              </div>
            </Link>
          )}
        </div>

        {!isLoading && scrollState.activeIndex < scrollState.maxIndex && (
          <button
            type="button"
            aria-label={t("region.next")}
            onClick={() => scrollToIndex(scrollState.activeIndex + 1)}
            className="text-ocop hover:bg-ocop border-ocop/15 absolute top-1/2 right-2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-white/96 shadow-[0_8px_24px_rgba(11,107,58,0.14)] transition-colors hover:text-white sm:flex dark:border-gray-700 dark:bg-gray-900"
          >
            <Icon icon="mdi:chevron-right" width={28} />
          </button>
        )}

        {!isLoading && scrollState.maxIndex > 0 && (
          <div
            className="border-ocop/18 mx-auto mt-4 flex w-fit items-center justify-center gap-2 rounded-full border bg-white/80 px-3 py-1.5 shadow-[0_8px_20px_rgba(11,107,58,0.14)] backdrop-blur-sm dark:border-white/10 dark:bg-gray-950/50 dark:shadow-[0_8px_22px_rgba(0,0,0,0.30)]"
            aria-label={t("region.pagination")}
          >
            {Array.from({ length: scrollState.maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t("region.page", { page: index + 1 })}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "border-ocop/20 bg-ocop/24 hover:bg-ocop/55 h-3 w-3 rounded-full border shadow-[0_1px_4px_rgba(11,107,58,0.16)] transition-all dark:border-white/15 dark:bg-white/20 dark:hover:bg-white/45",
                  scrollState.activeIndex === index &&
                    "bg-ocop border-ocop w-5 shadow-[0_2px_8px_rgba(11,107,58,0.32)] dark:border-white dark:bg-white dark:shadow-[0_0_12px_rgba(255,255,255,0.42)]",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
