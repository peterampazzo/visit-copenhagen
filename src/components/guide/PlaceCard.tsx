import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";

import type { GuideItem } from "@/lib/guide-content";

export function PlaceCard({
  item,
  linkLabel,
  index,
}: {
  item: GuideItem;
  linkLabel: string;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.035, 0.18) }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="flex h-full flex-col rounded-3xl border-2 border-ink/12 bg-card p-5 shadow-[3px_3px_0_color-mix(in_srgb,var(--ink)_18%,transparent)] transition-shadow hover:border-ink/25 hover:shadow-pop sm:p-6"
    >
      <h4 className="font-display text-xl font-bold leading-tight text-ink">{item.name}</h4>
      {item.note ? <p className="mt-2 flex-1 leading-6 text-ink/68">{item.note}</p> : null}
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-cream transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {linkLabel}
          <ExternalLink aria-hidden="true" size={16} strokeWidth={2.5} />
        </a>
      ) : null}
    </motion.article>
  );
}
