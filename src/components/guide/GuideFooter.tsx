import { ArrowUpRight, Github } from "lucide-react";

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
    <footer className="border-t-2 border-ink bg-[#262d2f] px-4 pb-28 pt-10 text-cream sm:px-6 sm:py-12 lg:pb-12">
      <div className="mx-auto grid max-w-6xl items-center gap-8 sm:grid-cols-[0.85fr_1.15fr] sm:gap-12">
        <div className="order-2 text-center sm:order-1 sm:text-left">
          <p className="font-display text-5xl font-extrabold tracking-[-0.05em] sm:text-6xl">
            {title}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-cream/80 sm:mx-0 sm:text-base">
            {credit}
          </p>
          <a
            href="https://github.com/peterampazzo/visit-copenhagen"
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-cream/35 px-4 py-2 text-sm font-extrabold text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
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
          className="order-1 w-[82%] max-w-[19rem] justify-self-center rounded-sm bg-cream p-2.5 pb-3 text-ink shadow-[6px_7px_0_rgba(0,0,0,0.22)] sm:order-2 sm:w-[92%] sm:max-w-[36rem] sm:-rotate-1 sm:justify-self-end"
          aria-hidden="true"
        >
          <div className="aspect-[4/3] overflow-hidden border border-ink/20 bg-[linear-gradient(90deg,#fff8ea_0%,#dceeed_48%,#c7e9e6_100%)] sm:aspect-[2/1]">
            <img
              src="/copenhagen-postcard.svg?v=3"
              alt=""
              width="1200"
              height="380"
              loading="lazy"
              className="h-full w-full object-cover object-right contrast-[1.03] saturate-[1.06]"
            />
          </div>

          <div className="relative px-12 pb-1 pt-3 text-center">
            <p className="font-serif text-xl uppercase tracking-[0.2em] sm:text-2xl">København</p>
            <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-ink/50">
              Hilsen fra Danmark
            </p>

            <div className="absolute bottom-0 right-0 grid h-12 w-10 rotate-3 place-items-center border-2 border-dashed border-coral/80 bg-cream text-coral shadow-[1px_1px_0_rgba(21,59,60,0.2)]">
              <span className="absolute top-1 text-[5px] font-black uppercase tracking-[0.1em]">
                Danmark
              </span>
              <span className="relative mt-1 block h-5 w-7 bg-[#d52b1e]">
                <span className="absolute inset-y-0 left-[8px] w-1 bg-cream" />
                <span className="absolute inset-x-0 top-[8px] h-1 bg-cream" />
              </span>
              <span className="absolute bottom-0.5 right-1 text-[5px] font-black">25</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
