import { BookOpenText, ExternalLink, Instagram, MapPin, Star, TramFront } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { useFavourites } from "@/hooks/use-favourites";
import type { GuideItem } from "@/lib/guide-content";
import type { GuideMapPlace } from "@/lib/locations";
import { cn } from "@/lib/utils";

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
  const hasStory = Boolean(item.story || item.storyItems?.length);
  const showTextLink = Boolean(item.url && item.linkText && !hasStory);
  const showIconLink = Boolean(item.url && !hasStory && !item.linkText);
  const hasActions = Boolean(item.travel || hasStory || showTextLink || showIconLink || mapPlace);

  const actionPill =
    "inline-flex min-h-9 items-center gap-1.5 rounded-full bg-harbour/10 px-3 text-xs font-extrabold text-harbour transition-colors hover:bg-sun hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.36, delay: Math.min(index * 0.035, 0.18) }}
        whileTap={{ scale: 0.995 }}
        className="group relative flex min-w-0 flex-col rounded-2xl border-2 border-ink/12 bg-card/95 p-4 shadow-[2px_2px_0_rgb(20_55_56_/_0.08)] transition-colors hover:border-harbour/35 hover:bg-cream"
      >
        {mapPlace ? (
          <button
            type="button"
            onClick={() => toggle(item.id)}
            aria-pressed={saved}
            aria-label={saved ? favouriteCopy.remove : favouriteCopy.add}
            title={saved ? favouriteCopy.remove : favouriteCopy.add}
            className="absolute right-1.5 top-1.5 grid min-h-11 min-w-11 place-items-center rounded-full transition-colors hover:bg-sun focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Star
              aria-hidden="true"
              size={19}
              strokeWidth={2.25}
              className={saved ? "fill-sun text-ink" : "text-ink/35"}
            />
          </button>
        ) : null}

        <div className={cn("min-w-0 flex-1", mapPlace && "pr-10")}>
          {item.kicker ? (
            <p className="mb-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-harbour/85">
              {item.kicker}
            </p>
          ) : null}
          {mapPlace ? (
            <h4 className="font-display text-[1.05rem] font-bold leading-snug text-ink sm:text-lg">
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
            <h4 className="font-display text-[1.05rem] font-bold leading-snug text-ink sm:text-lg">
              {item.name}
            </h4>
          )}
          {item.note ? (
            <p className="mt-1.5 text-[0.95rem] leading-6 text-ink/70">{item.note}</p>
          ) : null}
        </div>

        {hasActions ? (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
            {item.travel ? (
              <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-sun/45 px-3 text-xs font-extrabold text-ink">
                <TramFront size={13} strokeWidth={2.5} aria-hidden="true" />
                {item.travel}
              </span>
            ) : null}
            {hasStory ? (
              <button type="button" onClick={() => setStoryOpen(true)} className={actionPill}>
                <BookOpenText size={14} strokeWidth={2.5} aria-hidden="true" />
                {storyCopy.label}
              </button>
            ) : null}
            {showTextLink ? (
              <a href={item.url} target="_blank" rel="noreferrer" className={actionPill}>
                {item.url?.includes("instagram.com") ? (
                  <Instagram size={14} strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <ExternalLink size={14} strokeWidth={2.5} aria-hidden="true" />
                )}
                {item.linkText}
              </a>
            ) : null}
            {showIconLink ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${linkLabel}: ${item.name}`}
                title={`${linkLabel}: ${item.name}`}
                className={actionPill}
              >
                <ExternalLink size={14} strokeWidth={2.5} aria-hidden="true" />
                {linkLabel}
              </a>
            ) : null}
            {mapPlace ? (
              <button
                type="button"
                onClick={() => onShowOnMap(mapPlace.id)}
                className={actionPill}
                aria-label={`${showOnMapLabel}: ${item.name}`}
              >
                <MapPin size={14} strokeWidth={2.5} aria-hidden="true" />
                {showOnMapLabel}
              </button>
            ) : null}
          </div>
        ) : null}
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
