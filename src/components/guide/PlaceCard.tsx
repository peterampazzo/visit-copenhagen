import { ExternalLink, MapPin } from "lucide-react";
import { motion } from "motion/react";

import type { GuideItem } from "@/lib/guide-content";
import type { GuideMapPlace } from "@/lib/locations";

export function PlaceCard({
  item,
  linkLabel,
  mapPlace,
  showOnMapLabel,
  onShowOnMap,
  index,
}: {
  item: GuideItem;
  linkLabel: string;
  mapPlace?: GuideMapPlace;
  showOnMapLabel: string;
  onShowOnMap: (id: string) => void;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.035, 0.18) }}
      className="min-w-0 bg-card/90 p-3.5 transition-colors hover:bg-cream sm:p-4"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
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
          {item.note ? (
            <p className="mt-1 text-sm leading-5 text-ink/65 sm:text-[0.95rem] sm:leading-5">
              {item.note}
            </p>
          ) : null}
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
      </div>
    </motion.article>
  );
}
