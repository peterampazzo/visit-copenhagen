import { BookOpenText, ExternalLink, MapPin, Star, TramFront } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { useFavourites } from "@/hooks/use-favourites";
import type { GuideItem } from "@/lib/guide-content";
import type { GuideMapPlace } from "@/lib/locations";

import { GuideStoryDialog, type StoryCopy } from "./GuideStoryDialog";

export function PlaceCard({
  item,
  linkLabel,
  mapPlace,
  showOnMapLabel,
  onShowOnMap,
  storyCopy,
  index,
  favouriteCopy,
}: {
  item: GuideItem;
  linkLabel: string;
  mapPlace?: GuideMapPlace;
  showOnMapLabel: string;
  onShowOnMap: (id: string) => void;
  storyCopy: StoryCopy;
  index: number;
  favouriteCopy: { add: string; remove: string };
}) {
  const [storyOpen, setStoryOpen] = useState(false);
  const { isFavourite, toggle } = useFavourites();
  const saved = isFavourite(item.id);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.36, delay: Math.min(index * 0.035, 0.18) }}
        className="group min-w-0 bg-card/90 p-3.5 transition-colors hover:bg-cream sm:p-4"
      >
        <div className="flex h-full items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col self-stretch">
            {item.kicker ? (
              <p className="mb-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-harbour/85">
                {item.kicker}
              </p>
            ) : null}
            {mapPlace ? (
              <h4 className="font-display text-base font-bold leading-snug text-ink sm:text-lg">
                <button
                  type="button"
                  onClick={() => onShowOnMap(mapPlace.id)}
                  aria-label={`${showOnMapLabel}: ${item.name}`}
                  title={`${showOnMapLabel}: ${item.name}`}
                  className="inline-flex items-baseline gap-1.5 text-left decoration-harbour/40 decoration-dotted underline-offset-4 transition-colors hover:text-harbour hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span>{item.name}</span>
                  <MapPin
                    className="shrink-0 translate-y-0.5 text-harbour/65"
                    aria-hidden="true"
                    size={14}
                    strokeWidth={2.25}
                  />
                </button>
              </h4>
            ) : (
              <h4 className="font-display text-base font-bold leading-snug text-ink sm:text-lg">
                {item.name}
              </h4>
            )}
            {item.travel ? (
              <p className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-harbour/10 px-2.5 py-0.5 text-[0.7rem] font-extrabold text-harbour">
                <TramFront size={13} strokeWidth={2.5} aria-hidden="true" />
                {item.travel}
              </p>
            ) : null}
            {item.note ? (
              <p className="mt-1 text-sm leading-5 text-ink/65 sm:text-[0.95rem] sm:leading-5">
                {item.note}
              </p>
            ) : null}
            {item.story ? (
              <button
                type="button"
                onClick={() => setStoryOpen(true)}
                className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-harbour/9 px-2.5 py-1 text-xs font-extrabold text-harbour transition-colors hover:bg-sun hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <BookOpenText size={14} strokeWidth={2.5} aria-hidden="true" />
                {storyCopy.label}
              </button>
            ) : null}
          </div>

          {mapPlace ? (
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={saved}
              aria-label={saved ? favouriteCopy.remove : favouriteCopy.add}
              title={saved ? favouriteCopy.remove : favouriteCopy.add}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-sun focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Star
                aria-hidden="true"
                size={17}
                strokeWidth={2.25}
                className={saved ? "fill-sun text-ink" : "text-ink/35"}
              />
            </button>
          ) : null}

          {item.url && !item.story ? (
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
        </div>
      </motion.article>
      <GuideStoryDialog
        item={item}
        {...(mapPlace ? { mapPlace } : {})}
        copy={storyCopy}
        open={storyOpen}
        onOpenChange={setStoryOpen}
        onShowOnMap={onShowOnMap}
      />
    </>
  );
}
