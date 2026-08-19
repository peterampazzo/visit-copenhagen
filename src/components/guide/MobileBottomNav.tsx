import { MapPinned, Star, LayoutList, X } from "lucide-react";
import { useState } from "react";

import { useFavourites } from "@/hooks/use-favourites";
import type { GuideSectionData } from "@/lib/guide-content";
import { cn } from "@/lib/utils";

export function MobileBottomNav({
  sections,
  sectionsLabel,
  mapLabel,
  favouritesLabel,
  closeLabel,
  onOpenMap,
  onOpenFavourites,
}: {
  sections: GuideSectionData[];
  sectionsLabel: string;
  mapLabel: string;
  favouritesLabel: string;
  closeLabel: string;
  onOpenMap: () => void;
  onOpenFavourites: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { favourites } = useFavourites();

  const buttonClass =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-bold text-ink";

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-[4.5rem] mx-3 rounded-[1.5rem] border-2 border-ink bg-card p-3 shadow-pop-lg">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-display text-base font-extrabold">{sectionsLabel}</p>
              <button
                type="button"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink/15"
              >
                <X aria-hidden="true" size={17} strokeWidth={2.5} />
              </button>
            </div>
            <ul className="grid max-h-[50dvh] grid-cols-2 gap-2 overflow-y-auto">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center gap-2 rounded-2xl border-2 border-ink/12 bg-background px-3 text-sm font-semibold"
                  >
                    <span aria-hidden="true">{section.emoji}</span>
                    <span className="min-w-0 truncate">{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <nav
        aria-label={sectionsLabel}
        className="fixed inset-x-0 bottom-0 z-50 flex border-t-2 border-ink bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={buttonClass}
        >
          <LayoutList aria-hidden="true" size={20} strokeWidth={2.5} />
          {sectionsLabel}
        </button>
        <button type="button" onClick={onOpenMap} className={cn(buttonClass, "text-primary")}>
          <MapPinned aria-hidden="true" size={20} strokeWidth={2.5} />
          {mapLabel}
        </button>
        <button type="button" onClick={onOpenFavourites} className={buttonClass}>
          <span className="relative">
            <Star aria-hidden="true" size={20} strokeWidth={2.5} />
            {favourites.length > 0 ? (
              <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-extrabold text-primary-foreground">
                {favourites.length}
              </span>
            ) : null}
          </span>
          {favouritesLabel}
        </button>
      </nav>
    </>
  );
}
