import { MotionConfig } from "motion/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { GuideFooter } from "@/components/guide/GuideFooter";
import { GuideSection } from "@/components/guide/GuideSection";
import { Hero } from "@/components/guide/Hero";
import { MobileBottomNav } from "@/components/guide/MobileBottomNav";
import { SearchBar } from "@/components/guide/SearchBar";
import { SectionNav } from "@/components/guide/SectionNav";
import { itemMatchesQuery, toGuideSections, type GuideSectionsRecord } from "@/lib/guide-content";
import i18n, { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";
import { toGuideMapPlaces } from "@/lib/locations";

const GuideMapDialog = lazy(() => import("@/components/guide/GuideMapDialog"));

export function App() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<Language>("en");
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedMapPlaceId, setSelectedMapPlaceId] = useState<string | null>(null);
  const [mapFilter, setMapFilter] = useState<"all" | "favourites">("all");
  const [search, setSearch] = useState("");
  const sections = toGuideSections(
    t("sections", { returnObjects: true }) as unknown as GuideSectionsRecord,
  );
  const mapPlaces = toGuideMapPlaces(sections);

  const hasResults = useMemo(
    () =>
      sections.some((section) =>
        section.groups.some((group) =>
          group.items.some((item) => itemMatchesQuery(item, group.title, search)),
        ),
      ),
    [sections, search],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const preferred = SUPPORTED_LANGUAGES.includes(saved as Language) ? (saved as Language) : "en";
    setLanguage(preferred);
    void i18n.changeLanguage(preferred);
    document.documentElement.lang = preferred;
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    void i18n.changeLanguage(next);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  const openMap = (placeId: string | null = null, filter: "all" | "favourites" = "all") => {
    setSelectedMapPlaceId(placeId);
    setMapFilter(filter);
    setMapOpen(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-background">
        <Hero
          language={language}
          onLanguageChange={changeLanguage}
          title={t("site.title")}
          description={t("site.description")}
        />
        <div className="sticky top-0 z-30 border-b-2 border-ink/10 bg-background/95 px-4 py-2.5 backdrop-blur-md sm:px-6 lg:static lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="mx-auto max-w-6xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={t("site.searchPlaceholder")}
              label={t("site.searchLabel")}
              clearLabel={t("site.searchClear")}
            />
          </div>
        </div>
        <SectionNav
          sections={sections}
          label={t("site.nav")}
          mapLabel={t("site.mapLabel")}
          onOpenMap={() => openMap()}
        />
        {sections.map((section, index) => (
          <GuideSection
            key={section.id}
            section={section}
            sectionIndex={index}
            query={search}
            linkLabel={t("site.linkLabel")}
            mapPlaces={mapPlaces}
            showOnMapLabel={t("site.showOnMap")}
            onShowOnMap={(placeId) => openMap(placeId)}
            storyCopy={{
              label: t("site.storyLabel"),
              close: t("site.closeStory"),
              map: t("site.storyMapLabel"),
              learnMore: t("site.learnMoreLabel"),
            }}
            favouriteCopy={{
              add: t("site.favouriteAdd"),
              remove: t("site.favouriteRemove"),
            }}
          />
        ))}
        {!hasResults ? (
          <div className="px-4 py-16 text-center sm:px-6">
            <p className="font-display text-xl font-bold text-ink/80">
              {t("site.searchNoResults")}
            </p>
          </div>
        ) : null}
        <MobileBottomNav
          sections={sections}
          sectionsLabel={t("site.navLabel")}
          mapLabel={t("site.mapLabel")}
          favouritesLabel={t("site.favouritesLabel")}
          closeLabel={t("site.closeMap")}
          onOpenMap={() => openMap()}
          onOpenFavourites={() => openMap(null, "favourites")}
        />
        <GuideFooter
          title={t("site.footer")}
          credit={t("site.footerCredit")}
          source={t("site.footerSource")}
        />
        {mapOpen ? (
          <Suspense
            fallback={
              <div
                role="dialog"
                aria-modal="true"
                aria-label={t("site.mapTitle")}
                className="fixed inset-0 z-50 grid place-items-center bg-cream px-6 text-center text-ink"
              >
                <p className="font-display text-xl font-bold">{t("site.mapLoading")}</p>
              </div>
            }
          >
            <GuideMapDialog
              places={mapPlaces}
              initialSelectedId={selectedMapPlaceId}
              initialFilter={mapFilter}
              onClose={() => {
                setMapOpen(false);
                setSelectedMapPlaceId(null);
              }}
              copy={{
                title: t("site.mapTitle"),
                intro: t("site.mapIntro"),
                listLabel: t("site.mapListLabel"),
                close: t("site.closeMap"),
                all: t("site.allPlaces"),
                googleMaps: t("site.googleMapsLabel"),
                searchLabel: t("site.mapSearchLabel"),
                searchPlaceholder: t("site.mapSearchPlaceholder"),
                noResults: t("site.mapNoResults"),
                scopeLabel: t("site.mapScopeLabel"),
                scopeCity: t("site.mapScopeCity"),
                scopeAll: t("site.mapScopeAll"),
                scopeAllShort: t("site.mapScopeAllShort"),
                listToggle: t("site.mapListToggle"),
                sheetHandle: t("site.mapSheetHandle"),
                favourites: t("site.favouritesLabel"),
                favouriteAdd: t("site.favouriteAdd"),
                favouriteRemove: t("site.favouriteRemove"),
                favouritesEmpty: t("site.favouritesEmpty"),
                sortDefault: t("site.sortDefault"),
                sortNearMe: t("site.sortNearMe"),
                distanceUnitM: t("site.distanceUnitM"),
                distanceUnitKm: t("site.distanceUnitKm"),
                walkingTime: t("site.walkingTime"),
                locationDenied: t("site.locationDenied"),
              }}
            />
          </Suspense>
        ) : null}
      </main>
    </MotionConfig>
  );
}
