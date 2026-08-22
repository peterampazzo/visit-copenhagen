import { ArrowRight, ExternalLink, Footprints } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { itemMatchesQuery, type GuideGroup, type GuideSectionData } from "@/lib/guide-content";
import type { GuideMapPlace } from "@/lib/locations";
import { cn } from "@/lib/utils";

import { PlaceCard } from "./PlaceCard";
import type { StoryCopy } from "./GuideStoryDialog";

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
  query,
  linkLabel,
  mapPlaces,
  showOnMapLabel,
  onShowOnMap,
  storyCopy,
  favouriteCopy,
}: {
  section: GuideSectionData;
  sectionIndex: number;
  query: string;
  linkLabel: string;
  mapPlaces: GuideMapPlace[];
  showOnMapLabel: string;
  onShowOnMap: (id: string) => void;
  storyCopy: StoryCopy;
  favouriteCopy: { add: string; remove: string };
}) {
  const [activeCalendarGroup, setActiveCalendarGroup] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    return (
      section.groups.find((group) => group.collapsible && group.months?.includes(currentMonth))
        ?.id ?? null
    );
  });
  const visibleGroups = section.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => itemMatchesQuery(item, group.title, query)),
    }))
    .filter((group) => group.items.length > 0);
  const standardGroups = visibleGroups.filter((group) => !group.collapsible);
  const calendarGroups = visibleGroups.filter((group) => group.collapsible);
  const currentMonth = new Date().getMonth() + 1;

  const renderCards = (group: GuideGroup) => (
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
            storyCopy={storyCopy}
            favouriteCopy={favouriteCopy}
            index={index}
          />
        );
      })}
    </div>
  );

  const renderCalendarCards = (group: GuideGroup) => (
    <div className="overflow-hidden rounded-2xl border border-ink/15 bg-card/90">
      {group.items.map((item) => (
        <article
          key={item.id}
          className="flex items-start gap-3 border-b border-ink/12 px-4 py-3.5 last:border-b-0 sm:px-5"
        >
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h4 className="font-display text-base font-bold leading-snug text-ink sm:text-lg">
              {item.name}
            </h4>
            {item.note ? <p className="mt-0.5 text-sm leading-5 text-ink/65">{item.note}</p> : null}
          </div>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${linkLabel}: ${item.name}`}
              title={`${linkLabel}: ${item.name}`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-harbour transition-colors hover:bg-sun hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ExternalLink aria-hidden="true" size={16} strokeWidth={2.25} />
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );

  if (visibleGroups.length === 0) return null;

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
          {standardGroups.map((group) => {
            return (
              <div key={group.id}>
                <div className="mb-3">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink sm:text-xl">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    {group.title}
                  </h3>
                  {group.route ? (
                    <div className="scrollbar-none mt-3 flex items-center gap-2 overflow-x-auto rounded-2xl border-2 border-harbour/20 bg-card/70 px-3 py-2.5 text-xs font-bold text-ink/72 sm:w-fit sm:max-w-full sm:text-sm">
                      <span className="flex shrink-0 items-center gap-1.5 text-harbour">
                        <Footprints size={16} strokeWidth={2.5} aria-hidden="true" />
                        {group.route.label}
                      </span>
                      {group.route.stops.map((stop, index) => (
                        <span key={stop} className="flex shrink-0 items-center gap-2">
                          <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                          <span className="rounded-full bg-harbour/8 px-2.5 py-1">{stop}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {renderCards(group)}
              </div>
            );
          })}

          {calendarGroups.length > 0 ? (
            <div className="rounded-3xl border-2 border-ink/15 bg-card/65 p-3 shadow-[3px_3px_0_rgb(20_55_56_/_0.12)] sm:p-4">
              {section.calendarTitle ? (
                <p className="mb-3 px-1 text-sm font-extrabold uppercase tracking-[0.11em] text-harbour">
                  {section.calendarTitle}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {calendarGroups.map((group) => {
                  const isActive = group.id === activeCalendarGroup;
                  const isCurrentMonth = group.months?.includes(currentMonth);

                  return (
                    <button
                      key={group.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() =>
                        setActiveCalendarGroup((current) =>
                          current === group.id ? null : group.id,
                        )
                      }
                      className={cn(
                        "min-h-11 rounded-full border-2 px-4 font-display text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        isActive
                          ? "border-ink bg-ink text-card shadow-[2px_2px_0_var(--primary)]"
                          : "border-ink/12 bg-card text-ink hover:border-harbour/45 hover:bg-harbour/8",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            isActive || isCurrentMonth ? "bg-primary" : "bg-harbour/45",
                          )}
                          aria-hidden="true"
                        />
                        {group.title}
                      </span>
                    </button>
                  );
                })}
              </div>
              {(() => {
                const selectedGroup =
                  query.trim().length > 0
                    ? calendarGroups[0]
                    : calendarGroups.find((group) => group.id === activeCalendarGroup);

                return selectedGroup ? (
                  <motion.div
                    key={selectedGroup.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3"
                  >
                    <h3 className="mb-2 px-1 font-display text-xl font-bold text-ink">
                      {selectedGroup.title}
                    </h3>
                    {renderCalendarCards(selectedGroup)}
                  </motion.div>
                ) : null;
              })()}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
