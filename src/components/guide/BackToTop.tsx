import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={label}
          title={label}
          className="fixed bottom-[5.25rem] right-4 z-40 grid min-h-12 min-w-12 place-items-center rounded-full border-2 border-ink bg-card text-ink shadow-pop transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:bottom-6 lg:right-6"
        >
          <ArrowUp aria-hidden="true" size={22} strokeWidth={2.5} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
