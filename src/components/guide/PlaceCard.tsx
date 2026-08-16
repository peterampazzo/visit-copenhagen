import { ExternalLink, MapPin, MapPinned } from "lucide-react";
import { motion } from "motion/react";

import type { GuideItem } from "@/lib/guide-content";
import { googleMapsUrl, type GuideMapPlace } from "@/lib/locations";

export function PlaceCard({
  item,
  linkLabel,
  mapPlace,
  showOnMapLabel,
  googleMapsLabel,
  onShowOnMap,
  index,
}: {
  item: GuideItem;
  linkLabel: string;
  mapPlace?: GuideMapPlace;
  showOnMapLabel: string;
  googleMapsLabel: string;
  onShowOnMap: (id: string) => void;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.035, 0.18) }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="flex h-full flex-col rounded-2xl border-2 border-ink/12 bg-card p-4 shadow-[3px_3px_0_color-mix(in_srgb,var(--ink)_18%,transparent)] transition-shadow hover:border-ink/25 hover:shadow-pop sm:rounded-3xl sm:p-5"
    >
      <h4 className="font-display text-lg font-bold leading-tight text-ink sm:text-xl">
        {item.name}
      </h4>
      {item.note ? (
        <p className="mt-2 flex-1 text-[0.95rem] leading-6 text-ink/68 sm:text-base">{item.note}</p>
      ) : null}
      {item.url || mapPlace ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {mapPlace ? (
            <button
              type="button"
              onClick={() => onShowOnMap(mapPlace.id)}
              aria-label={`${showOnMapLabel}: ${item.name}`}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MapPinned aria-hidden="true" size={16} strokeWidth={2.5} />
              {showOnMapLabel}
            </button>
          ) : null}
          {mapPlace ? (
            <a
              href={googleMapsUrl(mapPlace)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${googleMapsLabel}: ${item.name}`}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-ink/20 bg-card px-3 py-1.5 text-sm font-bold text-ink transition-colors hover:border-harbour hover:text-harbour focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MapPin aria-hidden="true" size={16} strokeWidth={2.5} />
              {googleMapsLabel}
              <ExternalLink aria-hidden="true" size={13} strokeWidth={2.5} />
            </a>
          ) : null}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-3 py-1.5 text-sm font-bold text-cream transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {linkLabel}
              <ExternalLink aria-hidden="true" size={14} strokeWidth={2.5} />
            </a>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  );
}
