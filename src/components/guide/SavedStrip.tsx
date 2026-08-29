import { Star } from "lucide-react";
import { motion } from "motion/react";

import { useFavourites } from "@/hooks/use-favourites";
import type { GuideMapPlace } from "@/lib/locations";

export function SavedStrip({
  places,
  title,
  onOpenPlace,
}: {
  places: GuideMapPlace[];
  title: string;
  onOpenPlace: (placeId: string) => void;
}) {
  const { favourites } = useFavourites();
  const saved = places.filter((place) => favourites.includes(place.itemId));

  if (saved.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      aria-label={title}
      className="border-t-2 border-ink/10 bg-sun/12 px-4 py-3.5 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] text-ink/70">
          <Star size={13} strokeWidth={2.75} className="fill-sun text-ink" aria-hidden="true" />
          {title}
        </p>
        <ul className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1">
          {saved.map((place) => (
            <li key={place.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onOpenPlace(place.id)}
                className="min-h-11 rounded-full border-2 border-ink/15 bg-card px-3.5 text-sm font-bold text-ink transition-colors hover:border-harbour/45 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
