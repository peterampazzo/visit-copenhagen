import type { Language } from "@/lib/i18n";

import { LanguageToggle } from "./LanguageToggle";

export function Hero({
  language,
  onLanguageChange,
  title,
  description,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  title: string;
  description: string;
}) {
  return (
    <header className="relative overflow-hidden px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
      <div className="cph-hero relative mx-auto max-w-6xl">
        <div className="absolute right-4 top-4 z-20">
          <LanguageToggle value={language} onChange={onLanguageChange} />
        </div>

        <div className="cph-hero__copy relative z-10">
          <p className="mb-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-harbour">
            København · 55.6761° N
          </p>
          <h1 className="max-w-[35rem] text-balance font-display text-[clamp(2.8rem,5vw,4.35rem)] font-extrabold leading-[0.91] tracking-[-0.055em] text-ink">
            {title}
          </h1>
          <p className="mt-3.5 max-w-md text-[clamp(0.95rem,1.35vw,1.08rem)] font-semibold leading-[1.45] text-ink/75">
            {description}
          </p>
          <a
            href="#know"
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-2 text-sm font-extrabold text-ink shadow-pop transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            God tur <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="cph-landscape" aria-hidden="true">
          <img src="/copenhagen-hero.svg" alt="" width="1200" height="380" fetchPriority="high" />
        </div>
      </div>
    </header>
  );
}
