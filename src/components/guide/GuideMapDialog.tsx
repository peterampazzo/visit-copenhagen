import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, List, MapPin, Search, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useFavourites } from "@/hooks/use-favourites";
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
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  scopeLabel: string;
  scopeCity: string;
  scopeAll: string;
  listToggle: string;
  favourites: string;
  favouriteAdd: string;
  favouriteRemove: string;
  favouritesEmpty: string;
};

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
  const [mobileList, setMobileList] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { favourites, isFavourite, toggle } = useFavourites();

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
    listRef.current
      ?.querySelector<HTMLElement>(`[data-map-place="${selectedId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const selectPlace = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (places.find((place) => place.id === id)?.far) setScope("all");
      setMobileList(false);
    },
    [places],
  );

  const chipClass = (active: boolean, accent: "ink" | "primary") =>
    cn(
      "flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors",
      active
        ? accent === "ink"
          ? "border-ink bg-ink text-cream"
          : "border-primary bg-primary text-cream"
        : "border-ink/12 bg-card hover:border-primary/40",
    );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-[60] flex h-[100dvh] flex-col overflow-hidden bg-cream text-ink outline-none lg:inset-auto lg:left-1/2 lg:top-1/2 lg:h-[min(860px,92dvh)] lg:w-[min(1200px,94vw)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[2rem] lg:border-2 lg:border-ink lg:shadow-pop-lg">
          <header className="flex items-start gap-4 border-b-2 border-ink/10 px-4 py-3 sm:px-6 sm:py-5">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="font-display text-xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                {copy.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 hidden max-w-2xl text-sm leading-6 text-ink/65 sm:block sm:text-base">
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

          <div className="shrink-0 space-y-3 border-b-2 border-ink/10 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
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
                  className="min-h-11 w-full rounded-full border-2 border-ink/12 bg-card pl-10 pr-3 text-sm font-semibold placeholder:text-ink/40 focus-visible:border-primary focus-visible:outline-none"
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
                    {value === "city" ? copy.scopeCity : copy.scopeAll}
                  </button>
                ))}
              </div>
            </div>

            <div className="scrollbar-none flex gap-2 overflow-x-auto">
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

          <div className="relative min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem]">
            <div className="h-full overflow-hidden bg-harbour/10 lg:border-r-2 lg:border-ink/10">
              <GuideMapCanvas
                places={visiblePlaces}
                selectedId={selectedId}
                onSelect={selectPlace}
                googleMapsLabel={copy.googleMaps}
                mapTitle={copy.title}
                fitScope={scope}
              />
            </div>

            <aside
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 max-h-[72%] overflow-y-auto rounded-t-3xl border-t-2 border-ink bg-cream p-3 shadow-[0_-6px_0_rgba(0,0,0,0.06)] transition-transform lg:static lg:max-h-none lg:rounded-none lg:border-t-0 lg:p-4 lg:shadow-none",
                mobileList ? "translate-y-0" : "translate-y-full lg:translate-y-0",
              )}
              aria-label={copy.listLabel}
              aria-hidden={mobileList ? undefined : true}
            >
              <div ref={listRef} className="space-y-2">
                {visiblePlaces.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm font-semibold text-ink/60">
                    {activeSection === "favourites" && !query.trim()
                      ? copy.favouritesEmpty
                      : copy.noResults}
                  </p>
                ) : null}
                {visiblePlaces.map((place) => {
                  const saved = isFavourite(place.itemId);
                  return (
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
                      <button
                        type="button"
                        onClick={() => toggle(place.itemId)}
                        aria-pressed={saved}
                        aria-label={saved ? copy.favouriteRemove : copy.favouriteAdd}
                        className="grid w-11 shrink-0 place-items-center border-l-2 border-ink/10 transition-colors hover:bg-sun focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
                      >
                        <Star
                          aria-hidden="true"
                          size={18}
                          strokeWidth={2.5}
                          className={saved ? "fill-sun text-ink" : "text-ink/35"}
                        />
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
                  );
                })}
              </div>
            </aside>

            <button
              type="button"
              onClick={() => setMobileList((open) => !open)}
              aria-expanded={mobileList}
              className="absolute bottom-4 left-1/2 z-20 flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 text-sm font-extrabold text-ink shadow-[3px_3px_0_var(--ink)] lg:hidden"
            >
              {mobileList ? (
                <X size={17} strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <List size={17} strokeWidth={2.5} aria-hidden="true" />
              )}
              {mobileList ? copy.close : `${copy.listToggle} (${String(visiblePlaces.length)})`}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
