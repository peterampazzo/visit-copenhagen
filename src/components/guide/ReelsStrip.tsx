import { Play } from "lucide-react";
import { motion } from "motion/react";

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

        <div className="scrollbar-none -mx-4 snap-x snap-mandatory overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          <div className="flex gap-3 pb-2">
            {reels.items.map((reel, index) => {
              const theme = REEL_THEMES[index % REEL_THEMES.length];
              const hasLink = Boolean(reel.url);
              const Wrapper = hasLink ? "a" : "div";

              return (
                <motion.div
                  key={reel.id}
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
                    {reel.image ? (
                      <img
                        src={reel.image}
                        alt={reel.caption}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={cn(
                          "absolute inset-0 opacity-20",
                          theme,
                        )}
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={cn(
                        "absolute inset-0",
                        reel.image
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
    </section>
  );
}
