"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/theme-context";
import { useReducedMotion } from "framer-motion";
import { ChatLogoShape } from "./chat-logo-shape";

const TAGLINE = "INITIATING BREACH";

type BurstState = "idle" | "small" | "big";

export function Hero() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [burst, setBurst] = useState<BurstState>("idle");
  const [sliceTop, setSliceTop] = useState(40);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRed = theme === "dark";

  useEffect(() => {
    if (shouldReduceMotion || !isRed) return;

    let burstCount = 0;

    function scheduleNext() {
      const delay = 4000 + Math.random() * 3000;
      timeoutRef.current = setTimeout(() => {
        burstCount++;
        const isBig = burstCount % 4 === 0;
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

  return (
    <section className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden flex flex-col items-center justify-center px-6">
      {!shouldReduceMotion && isRed && (
        <div className="hero-scanline pointer-events-none absolute inset-0" />
      )}

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
          <ChatLogoShape className="hero-logo" fill="var(--hero-red)" />

          {isRed && !shouldReduceMotion && (
            <>
              <ChatLogoShape
                className="hero-logo hero-logo-ghost hero-logo-ghost-a"
                fill="#6d4c96"
              />
              <ChatLogoShape
                className="hero-logo hero-logo-ghost hero-logo-ghost-b"
                fill="#6d4c96"
              />
              <ChatLogoShape
                className="hero-logo hero-logo-slice"
                fill="var(--hero-red)"
                style={{
                  clipPath: `inset(${sliceTop}% 0 ${100 - sliceTop - 12}% 0)`,
                }}
              />
              <ChatLogoShape
                className="hero-logo hero-logo-noise"
                fill="var(--hero-red)"
              />
            </>
          )}
        </div>

        {isRed && (
          <p
            className={`mt-6 font-mono text-sm sm:text-base font-bold tracking-[0.3em] text-[var(--hero-red)] ${
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
        <span className="font-mono text-xs tracking-[0.25em] font-medium text-foreground/70">
          SCROLL<span className="term-cursor">_</span>
        </span>
        <span className="scroll-chevron block text-foreground/70">⌄</span>
      </div>
    </section>
  );
}