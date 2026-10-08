import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LanguageToggle({
  value,
  onChange,
}: {
  value: Language;
  onChange: (lang: Language) => void;
  layoutId?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-1 rounded-full border-2 border-ink/10 bg-card p-1 shadow-pop"
      role="group"
      aria-label={t("site.langLabel")}
    >
      <div className="relative grid grid-cols-2 gap-1">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 size-11 rounded-full bg-primary"
          initial={false}
          animate={{ x: value === "it" ? 48 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = lang === value;
        return (
          <Button
            key={lang}
            variant="ghost"
            type="button"
            onClick={() => onChange(lang)}
            aria-pressed={active}
            className={cn(
              "relative size-11 rounded-full p-0 text-sm font-semibold hover:bg-transparent",
              active ? "text-primary-foreground" : "text-ink/60 hover:text-ink",
            )}
          >
            <span className="relative">{lang === "en" ? "EN" : "IT"}</span>
            <span className="sr-only"> — {LANGUAGE_LABELS[lang]}</span>
          </Button>
        );
      })}
      </div>
    </div>
  );
}
