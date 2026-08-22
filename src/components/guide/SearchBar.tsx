import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  placeholder,
  label,
  clearLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  clearLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <span className="sr-only">{label}</span>
      <Search
        className="pointer-events-none absolute left-3.5 text-ink/45"
        size={18}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-12 w-full rounded-full border-2 border-ink/12 bg-card pl-11 pr-10 text-base font-semibold placeholder:text-ink/40 focus-visible:border-primary focus-visible:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel}
          className="absolute right-2 grid h-8 w-8 place-items-center rounded-full text-ink/50 transition-colors hover:bg-sun hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
