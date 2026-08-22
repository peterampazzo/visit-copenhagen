import * as Dialog from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Locate,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFavourites } from "@/hooks/use-favourites";
import { formatDistance, haversineMeters, walkingMinutes } from "@/lib/distance";
import { cn } from "@/lib/utils";
import { googleMapsUrl, type GuideMapPlace } from "@/lib/locations";


import { GuideMapCanvas } from "./GuideMapCanvas";
import { MapPlaceSheet, type SheetSnap } from "./MapPlaceSheet";

type MapCopy = {
  title: string;
  intro: string;
  listLabel: string;
  close: string;
  all: string;
  googleMaps: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  scopeLabel: string;
  scopeCity: string;
  scopeAll: string;
  scopeAllShort: string;
  listToggle: string;
  sheetHandle: string;
  favourites: string;
  favouriteAdd: string;
  favouriteRemove: string;
  favouritesEmpty: string;
};

const BOTTOM_PADDING: Record<SheetSnap, number> = { peek: 190, half: 300, full: 300 };

export default function GuideMapDialog({
  places,
  initialSelectedId,
  initialFilter = "all",
  onClose,
  copy,
}: {
  places: GuideMapPlace[];
  initialSelectedId: string | null;
  initialFilter?: "all" | "favourites";
  onClose: () => void;
  copy: MapCopy;
}) {
  const initialPlace = places.find(({ id }) => id === initialSelectedId);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [activeSection, setActiveSection] = useState(
    initialPlace?.sectionId ?? (initialFilter === "favourites" ? "favourites" : "all"),
  );
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"city" | "all">(initialPlace?.far ? "all" : "city");
  const [snap, setSnap] = useState<SheetSnap>("peek");
  const listRef = useRef<HTMLDivElement>(null);
  const { favourites, isFavourite, toggle } = useFavourites();

  const sections = useMemo(
    () =>
      Array.from(
        new Map(
          places.map((place) => [
            place.sectionId,
            { id: place.sectionId, title: place.sectionTitle, emoji: place.sectionEmoji },
          ]),
        ).values(),
      ),
    [places],
  );

  const visiblePlaces = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return places.filter((place) => {
      if (activeSection === "favourites" && !favourites.includes(place.itemId)) return false;
      if (
        activeSection !== "all" &&
        activeSection !== "favourites" &&
        place.sectionId !== activeSection
      )
        return false;
      if (!needle) return true;
      return `${place.name} ${place.note ?? ""}`.toLowerCase().includes(needle);
    });
  }, [activeSection, favourites, places, query]);

  useEffect(() => {
    if (selectedId && !visiblePlaces.some(({ id }) => id === selectedId)) setSelectedId(null);
  }, [selectedId, visiblePlaces]);

  useEffect(() => {
    if (!selectedId) return;
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() => listRef.current?.parentElement?.scrollTo({ top: 0 }));
      return;
    }
    listRef.current
      ?.querySelector<HTMLElement>(`[data-map-place="${selectedId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const selectPlace = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (places.find((place) => place.id === id)?.far) setScope("all");
      setSnap("peek");
    },
    [places],
  );

  const selectedPlace = visiblePlaces.find(({ id }) => id === selectedId) ?? null;
  const selectedIndex = selectedPlace ? visiblePlaces.indexOf(selectedPlace) : -1;
  const cardOnly = snap === "peek" && selectedPlace !== null;

  const step = (delta: number) => {
    if (visiblePlaces.length === 0) return;
    const next = visiblePlaces[(selectedIndex + delta + visiblePlaces.length) % visiblePlaces.length];
    if (next) selectPlace(next.id);
  };

  const chipClass = (active: boolean, accent: "ink" | "primary") =>
    cn(
      "flex min-h-10 shrink-0 snap-start items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors",
      active
        ? accent === "ink"
          ? "border-ink bg-ink text-cream"
          : "border-primary bg-primary text-cream"
        : "border-ink/12 bg-card hover:border-primary/40",
    );

  const filters = (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <label className="relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">{copy.searchLabel}</span>
          <Search
            className="pointer-events-none absolute left-3 text-ink/45"
            size={17}
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="min-h-11 w-full rounded-full border-2 border-ink/12 bg-card pl-10 pr-3 text-base font-semibold placeholder:text-ink/40 focus-visible:border-primary focus-visible:outline-none sm:text-sm"
          />
        </label>
        <div
          role="group"
          aria-label={copy.scopeLabel}
          className="flex shrink-0 rounded-full border-2 border-ink/12 bg-card p-0.5"
        >
          {(["city", "all"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={scope === value}
              onClick={() => setScope(value)}
              className={cn(
                "min-h-9 rounded-full px-3 text-xs font-extrabold transition-colors sm:text-sm",
                scope === value ? "bg-ink text-cream" : "text-ink/60 hover:text-ink",
              )}
            >
              {value === "city" ? (
                copy.scopeCity
              ) : (
                <>
                  <span className="sm:hidden">{copy.scopeAllShort}</span>
                  <span className="hidden sm:inline">{copy.scopeAll}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto pb-0.5">
        <button
          type="button"
          aria-pressed={activeSection === "all"}
          onClick={() => setActiveSection("all")}
          className={chipClass(activeSection === "all", "ink")}
        >
          {copy.all}
        </button>
        <button
          type="button"
          aria-pressed={activeSection === "favourites"}
          onClick={() => setActiveSection("favourites")}
          className={chipClass(activeSection === "favourites", "primary")}
        >
          <Star size={15} strokeWidth={2.5} aria-hidden="true" />
          {copy.favourites}
          {favourites.length > 0 ? ` (${String(favourites.length)})` : ""}
        </button>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            aria-pressed={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            className={chipClass(activeSection === section.id, "primary")}
          >
            <span aria-hidden="true">{section.emoji}</span>
            {section.title}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-[60] flex h-[100dvh] flex-col overflow-hidden bg-cream text-ink outline-none lg:inset-auto lg:left-1/2 lg:top-1/2 lg:h-[min(860px,92dvh)] lg:w-[min(1200px,94vw)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[2rem] lg:border-2 lg:border-ink lg:shadow-pop-lg">
          <header className="flex shrink-0 items-center gap-3 border-b-2 border-ink/10 px-4 py-2.5 sm:px-6 sm:py-5">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="truncate font-display text-lg font-extrabold tracking-[-0.03em] sm:text-4xl">
                {copy.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 hidden max-w-2xl text-sm leading-6 text-ink/65 lg:block lg:text-base">
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

          <div className="hidden shrink-0 border-b-2 border-ink/10 px-4 py-3 sm:px-6 lg:block">
            {filters}
          </div>

          <div className="relative min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem]">
            <div className="h-full overflow-hidden bg-harbour/10 lg:border-r-2 lg:border-ink/10">
              <GuideMapCanvas
                places={visiblePlaces}
                selectedId={selectedId}
                onSelect={selectPlace}
                mapTitle={copy.title}
                fitScope={scope}
                bottomPadding={BOTTOM_PADDING[snap]}
              />
            </div>

            <MapPlaceSheet
              snap={snap}
              onSnapChange={setSnap}
              handleLabel={copy.sheetHandle}
              label={copy.listLabel}
            >
              <div className={cn("lg:hidden", cardOnly && "hidden")}>{filters}</div>

              {selectedPlace ? (
                <div className="mt-2.5 rounded-2xl border-2 border-primary bg-card p-3.5 lg:hidden">
                  <div className="flex items-start gap-2">
                    <p className="min-w-0 flex-1 font-display font-bold leading-tight">
                      {selectedPlace.sectionEmoji} {selectedPlace.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggle(selectedPlace.itemId)}
                      aria-pressed={isFavourite(selectedPlace.itemId)}
                      aria-label={
                        isFavourite(selectedPlace.itemId) ? copy.favouriteRemove : copy.favouriteAdd
                      }
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink/12"
                    >
                      <Star
                        aria-hidden="true"
                        size={18}
                        strokeWidth={2.5}
                        className={
                          isFavourite(selectedPlace.itemId) ? "fill-sun text-ink" : "text-ink/35"
                        }
                      />
                    </button>
                  </div>
                  {selectedPlace.travel ? (
                    <p className="mt-1.5 inline-flex rounded-full border-2 border-ink/12 px-2.5 py-0.5 text-xs font-bold text-ink/70">
                      🚆 {selectedPlace.travel}
                    </p>
                  ) : null}
                  {selectedPlace.note ? (
                    <p className="mt-1.5 text-sm leading-5 text-ink/65">{selectedPlace.note}</p>
                  ) : null}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={`${copy.listToggle}: ←`}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink/12"
                    >
                      <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <a
                      href={googleMapsUrl(selectedPlace)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 text-sm font-extrabold text-ink"
                    >
                      <MapPin size={17} strokeWidth={2.5} aria-hidden="true" />
                      {copy.googleMaps}
                    </a>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={`${copy.listToggle}: →`}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink/12"
                    >
                      <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}

              <div ref={listRef} className={cn("mt-2.5 space-y-2", cardOnly && "hidden lg:block")}>
                {visiblePlaces.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm font-semibold text-ink/60">
                    {activeSection === "favourites" && !query.trim()
                      ? copy.favouritesEmpty
                      : copy.noResults}
                  </p>
                ) : null}
                {visiblePlaces.map((place) => {
                  const saved = isFavourite(place.itemId);
                  const active = selectedId === place.id;
                  return (
                    <div
                      key={place.id}
                      data-map-place={place.id}
                      className={cn(
                        "overflow-hidden rounded-2xl border-2 bg-card transition-colors",
                        active ? "border-primary" : "border-ink/10",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => selectPlace(place.id)}
                        className="block w-full px-3.5 pb-2.5 pt-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
                      >
                        <span className="block font-display font-bold leading-tight">
                          {place.sectionEmoji} {place.name}
                        </span>
                        {place.travel ? (
                          <span className="mt-1.5 inline-flex rounded-full bg-harbour/10 px-2 py-0.5 text-[0.7rem] font-extrabold text-harbour">
                            🚆 {place.travel}
                          </span>
                        ) : null}
                        {place.note ? (
                          <span className="mt-1 line-clamp-2 block text-sm leading-5 text-ink/62">
                            {place.note}
                          </span>
                        ) : null}
                      </button>
                      <div className="flex items-center gap-2 border-t-2 border-ink/8 px-2.5 py-2">
                        <button
                          type="button"
                          onClick={() => toggle(place.itemId)}
                          aria-pressed={saved}
                          aria-label={saved ? copy.favouriteRemove : copy.favouriteAdd}
                          className={cn(
                            "inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 px-3 text-xs font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                            saved
                              ? "border-ink bg-sun text-ink"
                              : "border-ink/12 text-ink/70 hover:border-primary/40",
                          )}
                        >
                          <Star
                            aria-hidden="true"
                            size={15}
                            strokeWidth={2.5}
                            className={saved ? "fill-ink text-ink" : ""}
                          />
                          {copy.favourites}
                        </button>
                        <a
                          href={googleMapsUrl(place)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${copy.googleMaps}: ${place.name}`}
                          className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 border-ink/12 px-3 text-xs font-extrabold text-harbour transition-colors hover:border-primary/40 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <MapPin size={15} strokeWidth={2.5} aria-hidden="true" />
                          {copy.googleMaps}
                          <ExternalLink size={11} strokeWidth={3} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  );
                })}

              </div>
            </MapPlaceSheet>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
