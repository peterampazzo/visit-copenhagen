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
  googleMapsLabel,
  onShowOnMap,
}: {
  section: GuideSectionData;
  sectionIndex: number;
  linkLabel: string;
  mapPlaces: GuideMapPlace[];
  showOnMapLabel: string;
  googleMapsLabel: string;
  onShowOnMap: (id: string) => void;
}) {
  return (
    <section
      id={section.id}
      className={cn(
        "scroll-mt-16 border-t-2 border-ink/10 px-4 py-14 sm:px-6 sm:py-20",
        SECTION_THEMES[sectionIndex % SECTION_THEMES.length],
      )}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42 }}
          className="mb-8 flex items-start gap-4 sm:mb-10 sm:gap-6"
        >
          <span
            aria-hidden="true"
            className="grid h-14 w-14 shrink-0 rotate-[-3deg] place-items-center rounded-2xl border-2 border-ink bg-card text-3xl shadow-pop sm:h-16 sm:w-16 sm:text-4xl"
          >
            {section.emoji}
          </span>
          <div>
            <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl">
              {section.title}
            </h2>
            {section.blurb ? (
              <p className="mt-2 max-w-2xl text-base leading-7 text-ink/68 sm:text-lg">
                {section.blurb}
              </p>
            ) : null}
          </div>
        </motion.div>

        <div className="space-y-10 sm:space-y-14">
          {section.groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-5 flex items-center gap-3 font-display text-xl font-bold text-ink sm:text-2xl">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                {group.title}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {group.items.map((item, index) => {
                  const mapPlace = mapPlaces.find(({ itemId }) => itemId === item.id);
                  return (
                    <PlaceCard
                      key={item.id}
                      item={item}
                      linkLabel={linkLabel}
                      {...(mapPlace ? { mapPlace } : {})}
                      showOnMapLabel={showOnMapLabel}
                      googleMapsLabel={googleMapsLabel}
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
