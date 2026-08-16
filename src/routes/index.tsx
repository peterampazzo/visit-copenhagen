import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Hero } from "@/components/guide/Hero";
import { GuideSection } from "@/components/guide/GuideSection";
import { SectionNav } from "@/components/guide/SectionNav";
import { toGuideSections, type GuideSectionsRecord } from "@/lib/guide-content";
import i18n, { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A København sono tutti matti — Copenhagen guide" },
      {
        name: "description",
        content: "A personal, bilingual guide to Copenhagen for visiting friends.",
      },
      { property: "og:title", content: "A København sono tutti matti" },
      {
        property: "og:description",
        content: "A personal, bilingual guide to Copenhagen for visiting friends.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og.png" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "A København sono tutti matti" },
      {
        name: "twitter:description",
        content: "A personal, bilingual guide to Copenhagen for visiting friends.",
      },
      { name: "twitter:image", content: "/og.png" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<Language>("en");
  const sections = toGuideSections(
    t("sections", { returnObjects: true }) as unknown as GuideSectionsRecord,
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

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-background">
        <Hero
          language={language}
          onLanguageChange={changeLanguage}
          eyebrow={t("site.eyebrow")}
          title={t("site.title")}
          subtitle={t("site.subtitle")}
          welcome={t("site.welcome")}
        />
        <SectionNav sections={sections} label={t("site.nav")} />
        {sections.map((section, index) => (
          <GuideSection
            key={section.id}
            section={section}
            sectionIndex={index}
            linkLabel={t("site.linkLabel")}
          />
        ))}
        <footer className="border-t-2 border-ink bg-ink px-4 py-12 text-center text-cream sm:px-6">
          <p className="font-display text-xl font-bold sm:text-2xl">{t("site.footer")}</p>
          <p className="mt-3 text-sm text-cream/60">København · 55.6761° N</p>
        </footer>
      </main>
    </MotionConfig>
  );
}
