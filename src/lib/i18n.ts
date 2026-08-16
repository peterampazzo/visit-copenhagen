import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { parse } from "yaml";

import enGuide from "../locales/en/guide.yaml?raw";
import itGuide from "../locales/it/guide.yaml?raw";

export const SUPPORTED_LANGUAGES = ["en", "it"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "cph-guide-language";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  it: "Italiano",
};

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources: {
      en: { guide: parse(enGuide) },
      it: { guide: parse(itGuide) },
    },
    lng: "en",
    fallbackLng: "en",
    defaultNS: "guide",
    ns: ["guide"],
    interpolation: { escapeValue: false },
  });
}

export default i18next;
