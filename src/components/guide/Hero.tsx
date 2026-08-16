import { motion } from "motion/react";

import type { Language } from "@/lib/i18n";

import { LanguageToggle } from "./LanguageToggle";

export function Hero({
  language,
  onLanguageChange,
  title,
  subtitle,
  welcome,
  eyebrow,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  title: string;
  subtitle: string;
  welcome: string;
  eyebrow: string;
}) {
  return (
    <header className="relative overflow-hidden px-4 pb-16 pt-5 sm:px-6 sm:pb-24 sm:pt-7">
      <div className="mx-auto flex max-w-6xl justify-end">
        <LanguageToggle value={language} onChange={onLanguageChange} />
      </div>

      <div className="relative mx-auto mt-14 max-w-6xl sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <p className="mb-5 inline-flex -rotate-2 rounded-full border-2 border-ink bg-sun px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.16em] shadow-pop sm:text-base">
            {eyebrow}
          </p>
          <h1 className="text-balance font-display text-[clamp(3.3rem,11vw,8.5rem)] font-extrabold leading-[0.82] tracking-[-0.075em] text-ink">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl font-display text-xl font-bold leading-tight text-primary sm:text-3xl">
            {subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/72 sm:text-lg sm:leading-8">
            {welcome}
          </p>
        </motion.div>

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: 30, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute -right-24 -top-10 hidden h-72 w-72 rounded-[3rem] border-2 border-ink bg-coral shadow-pop-lg lg:block"
        >
          <span className="absolute left-12 top-12 h-36 w-24 rounded-t-full border-2 border-ink bg-cream" />
          <span className="absolute bottom-12 right-10 h-20 w-20 rounded-full border-2 border-ink bg-harbour" />
          <span className="absolute bottom-11 left-12 font-display text-6xl font-black text-ink">
            CPH
          </span>
        </motion.div>

        <motion.a
          href="#know"
          aria-label="Start exploring the guide"
          animate={{ y: [0, -7, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-10 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-harbour text-2xl shadow-pop focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:absolute sm:bottom-0 sm:right-8 sm:mt-0"
        >
          <span aria-hidden="true">🚲</span>
        </motion.a>
      </div>
    </header>
  );
}
