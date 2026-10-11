import { Bookmark, Umbrella } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      "size-10 shrink-0 rounded-full border-2 p-0 text-xs font-extrabold shadow-none transition-colors sm:w-auto sm:px-3",
      active
        ? "border-coral bg-coral text-primary-foreground shadow-[2px_2px_0_var(--ink)] hover:bg-coral/90"
        : "border-ink/15 bg-card text-ink hover:border-harbour/45 hover:bg-cream",
    );

  return (
    <div role="group" aria-label={copy.label} className="flex shrink-0 items-center gap-1.5">
        <Button
          variant="ghost"
          type="button"
          aria-pressed={filters.mustSee}
          aria-label={copy.mustSee}
          title={copy.mustSee}
          onClick={() => onChange({ ...filters, mustSee: !filters.mustSee })}
          className={pill(filters.mustSee)}
        >
          <Bookmark strokeWidth={2.5} className="fill-current" aria-hidden="true" />
          <span className="hidden sm:inline">{copy.mustSee}</span>
        </Button>
        <Button
          variant="ghost"
          type="button"
          aria-pressed={filters.indoor}
          aria-label={copy.indoor}
          title={copy.indoor}
          onClick={() => onChange({ ...filters, indoor: !filters.indoor })}
          className={pill(filters.indoor)}
        >
          <Umbrella strokeWidth={2.5} aria-hidden="true" />
          <span className="hidden sm:inline">{copy.indoor}</span>
        </Button>
    </div>
  );
}
