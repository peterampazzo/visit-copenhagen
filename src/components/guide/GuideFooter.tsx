import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "motion/react";

export function GuideFooter({
  title,
  credit,
  source,
}: {
  title: string;
  credit: string;
  source: string;
}) {
  return (
    <footer className="border-t-2 border-ink bg-harbour px-4 pb-28 pt-10 text-cream sm:px-6 sm:py-12 lg:pb-12">
      <div className="mx-auto grid max-w-6xl items-center gap-8 sm:grid-cols-[0.9fr_1.1fr] sm:gap-12">
        <div>
          <p className="font-display text-[clamp(3.25rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.06em]">
            {title}
          </p>
          <p className="mt-4 max-w-md text-base font-semibold leading-6 text-cream/80">{credit}</p>
          <a
            href="https://github.com/peterampazzo/visit-copenhagen"
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-2 text-sm font-extrabold text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun"
          >
            <Github size={18} strokeWidth={2.4} aria-hidden="true" />
            {source}
            <ArrowUpRight
              size={17}
              strokeWidth={2.5}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <div
          className="overflow-hidden rounded-[1.75rem] border-2 border-ink bg-[#c7e9e6] shadow-[5px_5px_0_var(--ink)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 520 210" className="block h-auto w-full" role="presentation">
            <circle cx="445" cy="42" r="25" fill="var(--sun)" />

            <g stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round">
              <path d="M40 134V91l38-29 38 29v43Z" fill="var(--coral)" />
              <path d="M110 134V78h68v56Z" fill="var(--sun)" />
              <path d="m104 78 40-35 40 35Z" fill="var(--sun)" />
              <path d="M174 134V88l34-27 34 27v46Z" fill="var(--cream)" />
              <path d="M238 134V70h69v64Z" fill="#328ca1" />
              <path d="m231 70 42-38 42 38Z" fill="#328ca1" />
              <path d="M302 134V82h70v52Z" fill="var(--coral)" />
              <path d="M368 134V93l36-29 36 29v41Z" fill="var(--sun)" />
              <path d="M435 134V72h45v62Z" fill="var(--cream)" />
              <path d="m430 72 28-45 27 45Z" fill="var(--harbour)" />
            </g>

            <g fill="var(--cream)" stroke="var(--ink)" strokeWidth="2.5">
              {[58, 89, 126, 154, 191, 216, 254, 282, 319, 347, 385, 414, 448, 468].map(
                (x, index) => (
                  <rect key={x} x={x} y={index % 2 === 0 ? 101 : 96} width="12" height="17" />
                ),
              )}
            </g>

            <path d="M0 134h520v76H0Z" fill="#286765" stroke="var(--ink)" strokeWidth="4" />
            <g stroke="#a9dfdc" strokeWidth="4" strokeLinecap="round" opacity="0.9">
              <path d="m22 158 45 2m25 18 54-2m27-19 42 2m32 23 58-3m19-21 49 2m29 19 46-3m20-18 49 2" />
              <path d="m38 196 61-2m41-17 35 1m44 18 51-2m62-17 36 1m37 19 65-3" />
            </g>

            <motion.g
              animate={{ x: [-4, 7, -4], y: [-1, 2, -1] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <path
                d="m318 151 18 25h88l16-25Z"
                fill="var(--sun)"
                stroke="var(--ink)"
                strokeWidth="4"
              />
              <path
                d="M337 151v-19h66l18 19Z"
                fill="var(--cream)"
                stroke="var(--ink)"
                strokeWidth="4"
              />
              <path d="M352 133v17m22-17v17m22-17v17" stroke="var(--ink)" strokeWidth="3" />
              <rect
                x="405"
                y="138"
                width="23"
                height="13"
                rx="4"
                fill="var(--coral)"
                stroke="var(--ink)"
                strokeWidth="3"
              />
            </motion.g>

            <path d="M274 32v42" stroke="var(--ink)" strokeWidth="4" />
            <path
              d="M276 34c22-8 31 9 51 0v25c-20 9-29-8-51 0Z"
              fill="#d52b1e"
              stroke="var(--ink)"
              strokeWidth="3"
            />
            <path d="M290 31v31m-14-15h51" stroke="white" strokeWidth="7" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
