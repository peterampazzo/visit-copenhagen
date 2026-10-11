import { Bookmark, Umbrella, X } from "lucide-react";

import type { GuideFilters } from "@/lib/guide-content";
import { cn } from "@/lib/utils";

export function FilterPills({
  filters,
  onChange,
  copy,
}: {
  filters: GuideFilters;
  onChange: (next: GuideFilters) => void;
  copy: { label: string; mustSee: string; indoor: string; reset: string };
}) {
  const pill = (active: boolean) =>
    cn(
      "inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[0.72rem] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      active
        ? "border-coral bg-coral text-card shadow-[2px_2px_0_rgb(20_55_56_/_0.18)]"
        : "border-ink/12 bg-card/80 text-ink hover:border-harbour/45 hover:bg-cream",
    );
  const anyActive = filters.mustSee || filters.indoor;

  return (
    <div role="group" aria-label={copy.label} className="mx-auto mt-1.5 max-w-6xl">
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          aria-pressed={filters.mustSee}
          onClick={() => onChange({ ...filters, mustSee: !filters.mustSee })}
          className={pill(filters.mustSee)}
        >
          <Bookmark size={12} strokeWidth={2.5} className="fill-current" aria-hidden="true" />
          {copy.mustSee}
        </button>
        <button
          type="button"
          aria-pressed={filters.indoor}
          onClick={() => onChange({ ...filters, indoor: !filters.indoor })}
          className={pill(filters.indoor)}
        >
          <Umbrella size={12} strokeWidth={2.5} aria-hidden="true" />
          {copy.indoor}
        </button>
        {anyActive ? (
          <button
            type="button"
            onClick={() => onChange({ mustSee: false, indoor: false })}
            className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full px-2 text-[0.72rem] font-bold text-harbour underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={12} strokeWidth={2.5} aria-hidden="true" />
            {copy.reset}
          </button>
        ) : null}
      </div>
    </div>
  );
}
