import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  value,
  onChange,
}: {
  value: Language;
  onChange: (lang: Language) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-1 rounded-full border-2 border-ink/10 bg-card p-1 shadow-pop"
      role="group"
      aria-label={t("site.langLabel")}
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = lang === value;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            aria-pressed={active}
            className={cn(
              "relative min-h-9 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
              active ? "text-primary-foreground" : "text-ink/60 hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative">{lang === "en" ? "EN" : "IT"}</span>
            <span className="sr-only"> — {LANGUAGE_LABELS[lang]}</span>
          </button>
        );
      })}
    </div>
  );
}
