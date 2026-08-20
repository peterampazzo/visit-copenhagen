import { MotionConfig } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { GuideSection } from "@/components/guide/GuideSection";
import { Hero } from "@/components/guide/Hero";
import { MobileBottomNav } from "@/components/guide/MobileBottomNav";
import { SectionNav } from "@/components/guide/SectionNav";
import { toGuideSections, type GuideSectionsRecord } from "@/lib/guide-content";
import i18n, { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";
import { toGuideMapPlaces } from "@/lib/locations";

const GuideMapDialog = lazy(() => import("@/components/guide/GuideMapDialog"));

export function App() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<Language>("en");
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedMapPlaceId, setSelectedMapPlaceId] = useState<string | null>(null);
  const [mapFilter, setMapFilter] = useState<"all" | "favourites">("all");
  const sections = toGuideSections(
    t("sections", { returnObjects: true }) as unknown as GuideSectionsRecord,
  );
  const mapPlaces = toGuideMapPlaces(sections);

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
        <MobileBottomNav
          sections={sections}
          sectionsLabel={t("site.navLabel")}
          mapLabel={t("site.mapLabel")}
          favouritesLabel={t("site.favouritesLabel")}
          closeLabel={t("site.closeMap")}
          onOpenMap={() => openMap()}
          onOpenFavourites={() => openMap(null, "favourites")}
        />
        <footer className="border-t-2 border-ink bg-ink px-4 py-12 pb-28 text-center text-cream sm:px-6 lg:pb-12">
          <p className="font-display text-xl font-bold sm:text-2xl">{t("site.footer")}</p>
          <p className="mt-3 text-sm text-cream/60">København · 55.6761° N</p>
        </footer>
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
              }}
            />
          </Suspense>
        ) : null}
      </main>
    </MotionConfig>
  );
}
