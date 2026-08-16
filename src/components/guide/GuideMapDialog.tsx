import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { googleMapsUrl, type GuideMapPlace } from "@/lib/locations";

import { GuideMapCanvas } from "./GuideMapCanvas";

type MapCopy = {
  title: string;
  intro: string;
  listLabel: string;
  close: string;
  all: string;
  googleMaps: string;
};

export default function GuideMapDialog({
  places,
  initialSelectedId,
  onClose,
  copy,
}: {
  places: GuideMapPlace[];
  initialSelectedId: string | null;
  onClose: () => void;
  copy: MapCopy;
}) {
  const initialPlace = places.find(({ id }) => id === initialSelectedId);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [activeSection, setActiveSection] = useState(initialPlace?.sectionId ?? "all");
  const listRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () =>
      Array.from(
        new Map(
          places.map((place) => [
            place.sectionId,
            {
              id: place.sectionId,
              title: place.sectionTitle,
              emoji: place.sectionEmoji,
            },
          ]),
        ).values(),
      ),
    [places],
  );

  const visiblePlaces = useMemo(
    () =>
      activeSection === "all"
        ? places
        : places.filter(({ sectionId }) => sectionId === activeSection),
    [activeSection, places],
  );

  useEffect(() => {
    if (selectedId && !visiblePlaces.some(({ id }) => id === selectedId)) setSelectedId(null);
  }, [selectedId, visiblePlaces]);

  useEffect(() => {
    if (!selectedId) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-map-place="${selectedId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const selectPlace = useCallback((id: string) => setSelectedId(id), []);

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-[60] flex h-[100dvh] flex-col overflow-hidden bg-cream text-ink outline-none lg:inset-auto lg:left-1/2 lg:top-1/2 lg:h-[min(860px,92dvh)] lg:w-[min(1200px,94vw)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[2rem] lg:border-2 lg:border-ink lg:shadow-pop-lg">
          <header className="flex items-start gap-4 border-b-2 border-ink/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                {copy.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base">
                {copy.intro}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={copy.close}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-card transition-colors hover:bg-sun focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X aria-hidden="true" size={21} strokeWidth={2.5} />
            </Dialog.Close>
          </header>

          <div className="scrollbar-none flex shrink-0 gap-2 overflow-x-auto border-b-2 border-ink/10 px-4 py-3 sm:px-6">
            <button
              type="button"
              aria-pressed={activeSection === "all"}
              onClick={() => setActiveSection("all")}
              className={cn(
                "min-h-10 shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors",
                activeSection === "all"
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/12 bg-card hover:border-ink/35",
              )}
            >
              {copy.all}
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                aria-pressed={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors",
                  activeSection === section.id
                    ? "border-primary bg-primary text-cream"
                    : "border-ink/12 bg-card hover:border-primary/40",
                )}
              >
                <span aria-hidden="true">{section.emoji}</span>
                {section.title}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:overflow-hidden">
            <div className="h-[52svh] min-h-80 overflow-hidden border-b-2 border-ink/10 bg-harbour/10 lg:h-auto lg:min-h-0 lg:border-b-0 lg:border-r-2">
              <GuideMapCanvas
                places={visiblePlaces}
                selectedId={selectedId}
                onSelect={selectPlace}
                googleMapsLabel={copy.googleMaps}
                mapTitle={copy.title}
              />
            </div>

            <aside
              className="bg-cream p-3 sm:p-4 lg:min-h-0 lg:overflow-y-auto"
              aria-label={copy.listLabel}
            >
              <div ref={listRef} className="space-y-2">
                {visiblePlaces.map((place) => (
                  <div
                    key={place.id}
                    data-map-place={place.id}
                    className={cn(
                      "flex items-stretch overflow-hidden rounded-2xl border-2 bg-card transition-colors",
                      selectedId === place.id ? "border-primary" : "border-ink/10",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectPlace(place.id)}
                      className="min-w-0 flex-1 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
                    >
                      <span className="block font-display font-bold leading-tight">
                        {place.sectionEmoji} {place.name}
                      </span>
                      {place.note ? (
                        <span className="mt-1 line-clamp-2 block text-sm leading-5 text-ink/62">
                          {place.note}
                        </span>
                      ) : null}
                    </button>
                    <a
                      href={googleMapsUrl(place)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${copy.googleMaps}: ${place.name}`}
                      className="grid w-12 shrink-0 place-items-center border-l-2 border-ink/10 text-harbour transition-colors hover:bg-sun hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
                    >
                      <span className="relative" aria-hidden="true">
                        <MapPin size={20} strokeWidth={2.5} />
                        <ExternalLink
                          className="absolute -right-2 -top-2"
                          size={10}
                          strokeWidth={3}
                        />
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
