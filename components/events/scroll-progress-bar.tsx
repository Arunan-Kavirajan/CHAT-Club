"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vertical scroll-progress indicator, Events page only. Desktop-only —
 * hidden below `lg` since a fixed side element competes for space on
 * narrower viewports.
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(pct);
      rafRef.current = null;
    }
    function onScroll() {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 h-[45vh]">
      <span className="font-mono text-[10px] text-accent tracking-wider tabular-nums">
        {Math.round(progress)}%
      </span>
      <div className="relative w-px flex-1 bg-foreground/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full rounded-full transition-[height] duration-150 ease-out"
          style={{
            height: `${progress}%`,
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
          }}
        />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-px bg-foreground/25"
            style={{ top: `${(i / 4) * 100}%` }}
          />
        ))}
      </div>
      <span
        className="font-mono text-[9px] text-foreground/30 tracking-[0.3em]"
        style={{ writingMode: "vertical-rl" }}
      >
        SCROLL
      </span>
    </div>
  );
}