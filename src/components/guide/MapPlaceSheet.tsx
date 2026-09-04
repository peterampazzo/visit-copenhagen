import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SheetSnap = "peek" | "half" | "full";

const SNAP_HEIGHT: Record<SheetSnap, string> = {
  peek: "26%",
  half: "55%",
  full: "88%",
};

const ORDER: SheetSnap[] = ["peek", "half", "full"];

export function MapPlaceSheet({
  snap,
  onSnapChange,
  handleLabel,
  label,
  children,
}: {
  snap: SheetSnap;
  onSnapChange: (snap: SheetSnap) => void;
  handleLabel: string;
  label: string;
  children: React.ReactNode;
}) {
  const dragRef = useRef<{ startY: number; moved: boolean } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const finish = useCallback(
    (offset: number) => {
      const index = ORDER.indexOf(snap);
      if (offset > 60) onSnapChange(ORDER[Math.max(index - 1, 0)] ?? "peek");
      else if (offset < -60) onSnapChange(ORDER[Math.min(index + 1, ORDER.length - 1)] ?? "full");
      setDragOffset(0);
    },
    [onSnapChange, snap],
  );

  useEffect(() => {
    setDragOffset(0);
  }, [snap]);

  return (
    <aside
      aria-label={label}
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-3xl border-t-2 border-ink bg-cream shadow-[0_-6px_0_rgba(0,0,0,0.06)] transition-[height] duration-300 ease-out lg:static lg:!h-full lg:rounded-none lg:border-t-0 lg:shadow-none"
      style={{
        height: `calc(${SNAP_HEIGHT[snap]} - ${String(Math.round(dragOffset))}px)`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <button
        type="button"
        aria-label={handleLabel}
        onClick={() => {
          if (dragRef.current?.moved) return;
          const index = ORDER.indexOf(snap);
          onSnapChange(ORDER[(index + 1) % ORDER.length] ?? "peek");
        }}
        onPointerDown={(event) => {
          dragRef.current = { startY: event.clientY, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag) return;
          const offset = event.clientY - drag.startY;
          if (Math.abs(offset) > 6) drag.moved = true;
          setDragOffset(offset);
        }}
        onPointerUp={(event) => {
          const drag = dragRef.current;
          if (!drag) return;
          finish(event.clientY - drag.startY);
          setTimeout(() => (dragRef.current = null), 0);
        }}
        className="grid h-9 w-full shrink-0 touch-none place-items-center lg:hidden"
      >
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-12 rounded-full bg-ink/25 transition-colors", dragOffset !== 0 && "bg-ink/50")}
        />
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 lg:p-4">
        {children}
      </div>
    </aside>
  );
}
