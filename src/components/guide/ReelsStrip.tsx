import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ReelsSection } from "@/lib/guide-content";
import { cn } from "@/lib/utils";

const REEL_THEMES = [
  "bg-coral",
  "bg-harbour",
  "bg-sun",
  "bg-ink",
] as const;

export function ReelsStrip({
  reels,
  playLabel,
}: {
  reels: ReelsSection;
  playLabel: string;
}) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(`[data-reel-index="${index}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, []);

  const handlePrevious = useCallback(() => {
    const next = Math.max(0, activeIndex - 1);
    scrollToIndex(next);
  }, [activeIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    const next = Math.min(reels.items.length - 1, activeIndex + 1);
    scrollToIndex(next);
  }, [activeIndex, reels.items.length, scrollToIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || reels.items.length <= 1) return;

    const updateActive = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const center = scrollLeft + containerWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;

      container.querySelectorAll<HTMLElement>("[data-reel-index]").forEach((card) => {
        const index = Number(card.dataset["reelIndex"]);
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    container.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => container.removeEventListener("scroll", updateActive);
  }, [reels.items.length]);

  const canGoBack = activeIndex > 0;
  const canGoForward = activeIndex < reels.items.length - 1;

  return (
    <section className="border-t-2 border-ink/10 bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42 }}
          className="mb-5 sm:mb-6"
        >
          <h2 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-ink sm:text-3xl">
            {reels.title}
          </h2>
          {reels.blurb ? (
            <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-6 text-ink/68 sm:text-base">
              {reels.blurb}
            </p>
          ) : null}
        </motion.div>

        <div className="relative">
          {reels.items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!canGoBack}
                aria-label="Previous reel"
                className={cn(
                  "absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-card text-ink shadow-[2px_2px_0_var(--ink)] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex",
                  canGoBack
                    ? "hover:-translate-y-1/2 hover:translate-x-[-2px] hover:bg-cream active:scale-95"
                    : "opacity-0",
                )}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoForward}
                aria-label="Next reel"
                className={cn(
                  "absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-card text-ink shadow-[2px_2px_0_var(--ink)] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex",
                  canGoForward
                    ? "hover:-translate-y-1/2 hover:translate-x-[2px] hover:bg-cream active:scale-95"
                    : "opacity-0",
                )}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          ) : null}

          <div
            ref={scrollRef}
            className="scrollbar-none -mx-4 snap-x snap-mandatory overflow-x-auto px-4 sm:-mx-6 sm:px-6"
          >
            <div className="flex gap-3 pb-2">
              {reels.items.map((reel, index) => {
                const theme = REEL_THEMES[index % REEL_THEMES.length];
                const hasLink = Boolean(reel.url);
                const showImage = Boolean(reel.image) && !failed[reel.id];
                const Wrapper = hasLink ? "a" : "div";

                return (
                  <motion.div
                    key={reel.id}
                    data-reel-index={index}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-48px" }}
                    transition={{ duration: 0.36, delay: Math.min(index * 0.05, 0.2) }}
                    className="snap-start"
                  >
                    <Wrapper
                      {...(hasLink
                        ? {
                            href: reel.url,
                            target: "_blank",
                            rel: "noreferrer",
                            "aria-label": `${playLabel}: ${reel.caption}`,
                          }
                        : {})}
                      className={cn(
                        "group relative flex h-[17rem] w-[9.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-ink bg-card shadow-[3px_3px_0_var(--ink)] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-[20rem] sm:w-[11.25rem]",
                        hasLink && "hover:-translate-y-1 active:scale-[0.99]",
                      )}
                    >
                      {showImage ? (
                        <img
                          src={reel.image}
                          alt={reel.caption}
                          loading="lazy"
                          onError={() => setFailed((prev) => ({ ...prev, [reel.id]: true }))}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={cn(
                            "absolute inset-0 opacity-40",
                            theme,
                          )}
                          aria-hidden="true"
                        />
                      )}

                      <div
                        className={cn(
                          "absolute inset-0",
                          showImage
                            ? "bg-gradient-to-b from-ink/20 via-ink/5 to-ink/70"
                            : "bg-gradient-to-b from-ink/10 via-ink/5 to-ink/40",
                        )}
                        aria-hidden="true"
                      />

                      {hasLink ? (
                        <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border-2 border-card bg-ink/80 text-card backdrop-blur-sm transition-colors group-hover:bg-coral">
                          <Play size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                        </span>
                      ) : null}

                      <div className="relative mt-auto p-3 pt-8">
                        <p className="font-display text-sm font-extrabold leading-snug text-card drop-shadow-sm sm:text-base">
                          {reel.caption}
                        </p>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {reels.items.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Reels">
            {reels.items.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Go to reel ${index + 1}: ${reel.caption}`}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2 border-ink transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  activeIndex === index
                    ? "bg-coral shadow-[1px_1px_0_var(--ink)]"
                    : "bg-card hover:bg-cream",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

