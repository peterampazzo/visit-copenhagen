import { motion } from "motion/react";

import type { GuideSectionData } from "@/lib/guide-content";
import type { GuideMapPlace } from "@/lib/locations";
import { cn } from "@/lib/utils";

import { PlaceCard } from "./PlaceCard";

const SECTION_THEMES = [
  "bg-sun/14",
  "bg-harbour/12",
  "bg-coral/10",
  "bg-sun/10",
  "bg-harbour/10",
  "bg-coral/9",
  "bg-sun/12",
] as const;

export function GuideSection({
  section,
  sectionIndex,
  linkLabel,
  mapPlaces,
  showOnMapLabel,
  onShowOnMap,
}: {
  section: GuideSectionData;
  sectionIndex: number;
  linkLabel: string;
  mapPlaces: GuideMapPlace[];
  showOnMapLabel: string;
  onShowOnMap: (id: string) => void;
}) {
  return (
    <section
      id={section.id}
      className={cn(
        "scroll-mt-16 border-t-2 border-ink/10 px-4 py-10 sm:px-6 sm:py-14",
        SECTION_THEMES[sectionIndex % SECTION_THEMES.length],
      )}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42 }}
          className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-5"
        >
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 rotate-[-3deg] place-items-center rounded-2xl border-2 border-ink bg-card text-2xl shadow-[3px_3px_0_var(--ink)] sm:h-14 sm:w-14 sm:text-3xl"
          >
            {section.emoji}
          </span>
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">
              {section.title}
            </h2>
            {section.blurb ? (
              <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-6 text-ink/68 sm:text-base">
                {section.blurb}
              </p>
            ) : null}
          </div>
        </motion.div>

        <div className="space-y-8 sm:space-y-10">
          {section.groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-3 flex items-center gap-2.5 font-display text-lg font-bold text-ink sm:text-xl">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {group.title}
              </h3>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, index) => {
                  const mapPlace = mapPlaces.find(({ itemId }) => itemId === item.id);
                  return (
                    <PlaceCard
                      key={item.id}
                      item={item}
                      linkLabel={linkLabel}
                      {...(mapPlace ? { mapPlace } : {})}
                      showOnMapLabel={showOnMapLabel}
                      onShowOnMap={onShowOnMap}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
