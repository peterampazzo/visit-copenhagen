import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, BookOpenText, Lightbulb, MapPin, Play, X } from "lucide-react";

import type { GuideItem } from "@/lib/guide-content";
import type { GuideMapPlace } from "@/lib/locations";
import { cn } from "@/lib/utils";

export type StoryCopy = {
  label: string;
  close: string;
  map: string;
  learnMore: string;
  watchReel: string;
  openPhoto: string;
  goodToKnow: string;
};

export function GuideStoryDialog({
  item,
  mapPlace,
  copy,
  open,
  onOpenChange,
  onShowOnMap,
}: {
  item: GuideItem;
  mapPlace?: GuideMapPlace;
  copy: StoryCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowOnMap: (id: string) => void;
}) {
  if (!item.story && !item.storyItems?.length) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-x-3 bottom-3 z-[60] max-h-[88dvh] overflow-y-auto overscroll-contain rounded-[1.75rem] border-2 border-ink bg-cream text-ink shadow-pop-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom-5 data-[state=open]:slide-in-from-bottom-5 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(42rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2">
          <div className="relative h-28 overflow-hidden border-b-2 border-ink bg-harbour/15 sm:h-32">
            <span className="absolute right-8 top-5 h-12 w-12 rounded-full border-2 border-ink bg-sun sm:right-12 sm:h-14 sm:w-14" />
            <span className="absolute -bottom-4 left-7 h-20 w-24 rotate-[-5deg] rounded-t-[2.5rem] border-2 border-ink bg-coral" />
            <span className="absolute -bottom-5 left-24 h-24 w-28 rotate-[3deg] rounded-t-[3rem] border-2 border-ink bg-sun" />
            <span className="absolute -bottom-3 right-24 h-16 w-24 rotate-[-2deg] rounded-t-[2rem] border-2 border-ink bg-harbour" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border-2 border-ink bg-card px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.13em] shadow-[2px_2px_0_var(--ink)] sm:left-7">
              <BookOpenText size={15} strokeWidth={2.5} aria-hidden="true" />
              {copy.label}
            </div>
            <Dialog.Close
              aria-label={copy.close}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-card transition-colors hover:bg-sun focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X size={18} strokeWidth={2.75} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
            {item.kicker ? (
              <p className="mb-2 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-harbour">
                {item.kicker}
              </p>
            ) : null}
            <Dialog.Title className="font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
              {item.name}
            </Dialog.Title>
            {item.note ? (
              <Dialog.Description className="mt-3 max-w-xl text-base font-semibold leading-6 text-ink/68 sm:text-lg sm:leading-7">
                {item.note}
              </Dialog.Description>
            ) : null}

            {item.story ? (
              <div className="mt-5 border-l-4 border-coral pl-4 text-[0.98rem] leading-7 text-ink/80 sm:mt-6 sm:pl-5 sm:text-[1.05rem]">
                {item.story}
              </div>
            ) : null}

            {item.storyItems?.length ? (
              <ul className="mt-5 grid gap-2.5 text-[0.98rem] leading-6 text-ink/80 sm:mt-6 sm:text-[1.05rem] sm:leading-7">
                {item.storyItems.map((storyItem) => (
                  <li key={storyItem} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-coral"
                    />
                    <span>{storyItem}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {mapPlace || item.url ? (
              <div className="mt-6 flex flex-wrap gap-2.5 border-t-2 border-ink/10 pt-5">
                {mapPlace ? (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      onShowOnMap(mapPlace.id);
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-2 text-sm font-extrabold shadow-[2px_2px_0_var(--ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <MapPin size={17} strokeWidth={2.5} aria-hidden="true" />
                    {copy.map}
                  </button>
                ) : null}
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink/15 bg-card px-4 py-2 text-sm font-extrabold transition-colors hover:border-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {item.linkText ?? copy.learnMore}
                    <ArrowUpRight size={17} strokeWidth={2.5} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
