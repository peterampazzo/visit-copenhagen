import { useEffect, useState } from "react";

import type { GuideSectionData } from "@/lib/guide-content";
import { cn } from "@/lib/utils";

export function SectionNav({ sections, label }: { sections: GuideSectionData[]; label: string }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label={label}
      className="sticky top-0 z-40 border-b-2 border-ink/10 bg-background/90 backdrop-blur-md"
    >
      <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3 sm:justify-center">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className={cn(
                "flex min-h-10 items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors",
                active === section.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-ink/10 bg-card text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              <span aria-hidden="true">{section.emoji}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
