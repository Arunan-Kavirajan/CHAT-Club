"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/theme-context";
import { useReducedMotion } from "framer-motion";

const TAGLINE = "INITIATING BREACH";
const MASK_URL = "url(/logo/chat-logo-mask.png)";

type BurstState = "idle" | "small" | "big";

export function Hero() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [burst, setBurst] = useState<BurstState>("idle");
  const [sliceTop, setSliceTop] = useState(40);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRed = theme === "dark";

  useEffect(() => {
    // Blue Team's hero treatment is being designed separately — for now
    // it just gets the calm glow, no glitch cycle. Also fully skipped
    // under prefers-reduced-motion.
    if (shouldReduceMotion || !isRed) return;

    let burstCount = 0;

    function scheduleNext() {
      const delay = 4000 + Math.random() * 3000; // 4-7s, randomized on purpose
      timeoutRef.current = setTimeout(() => {
        burstCount++;
        const isBig = burstCount % 4 === 0; // roughly 1 in 4 bursts
        setSliceTop(15 + Math.random() * 55);
        setBurst(isBig ? "big" : "small");

        const burstDuration = isBig ? 550 : 220;
        setTimeout(() => setBurst("idle"), burstDuration);

        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isRed, shouldReduceMotion]);

  const maskStyle = { WebkitMaskImage: MASK_URL, maskImage: MASK_URL };

  return (
    <section className="relative h-dvh w-full overflow-hidden flex flex-col items-center justify-center px-6">
      {!shouldReduceMotion && isRed && (
        <div className="hero-scanline pointer-events-none absolute inset-0" />
      )}

      {/* Turbulence filter for the "big" burst's decrypt-into-noise moment.
          Zero-size, purely a filter definition — not visible itself. */}
      <svg width="0" height="0" className="absolute">
        <filter id="chat-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
          />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </svg>

      <div className="relative flex flex-col items-center">
        <div
          className={`hero-logo-wrap relative ${
            burst === "small" ? "burst-small" : burst === "big" ? "burst-big" : ""
          }`}
        >
          <div className="hero-logo" style={maskStyle} />

          {isRed && !shouldReduceMotion && (
            <>
              <div
                className="hero-logo hero-logo-ghost hero-logo-ghost-a"
                style={maskStyle}
              />
              <div
                className="hero-logo hero-logo-ghost hero-logo-ghost-b"
                style={maskStyle}
              />
              <div
                className="hero-logo hero-logo-slice"
                style={{
                  ...maskStyle,
                  clipPath: `inset(${sliceTop}% 0 ${100 - sliceTop - 12}% 0)`,
                }}
              />
              <div
                className="hero-logo hero-logo-noise"
                style={maskStyle}
              />
            </>
          )}
        </div>

        {isRed && (
          <p
            className={`mt-6 font-mono text-xs sm:text-sm tracking-[0.3em] text-foreground/60 ${
              burst === "big" ? "tagline-flicker" : ""
            }`}
          >
            {TAGLINE}
          </p>
        )}
      </div>

      <div
        className="absolute bottom-8 sm:bottom-10 flex flex-col items-center gap-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/40">
          SCROLL<span className="term-cursor">_</span>
        </span>
        <span className="scroll-chevron block text-foreground/40">⌄</span>
      </div>
    </section>
  );
}