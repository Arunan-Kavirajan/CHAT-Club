"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/theme-context";
import { useReducedMotion } from "framer-motion";
import { ChatLogoShape } from "./chat-logo-shape";
import { CircuitTraceBackground } from "./circuit-trace-background";
import { OrbitingSatellites } from "./orbiting-satellites";

const TAGLINE_RED = "INITIATING BREACH";
const TAGLINE_BLUE = "THREAT CONTAINED";
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_/[]{}=+*^?#";

type BurstState = "idle" | "small" | "big";

export function Hero() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [burst, setBurst] = useState<BurstState>("idle");
  const [sliceTop, setSliceTop] = useState(40);
  const [taglineDisplay, setTaglineDisplay] = useState(TAGLINE_RED);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taglineIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);

  const isRed = theme === "dark";
  const isBlue = !isRed;

  useEffect(() => {
    setTaglineDisplay(isRed ? TAGLINE_RED : TAGLINE_BLUE);
  }, [isRed]);

  function scrambleTagline(durationMs: number) {
    if (taglineIntervalRef.current) clearInterval(taglineIntervalRef.current);
    const length = TAGLINE_RED.length;
    const tickMs = 30;
    const totalTicks = Math.max(6, Math.round(durationMs / tickMs));
    let tick = 0;

    taglineIntervalRef.current = setInterval(() => {
      tick++;
      const revealCount = Math.floor((tick / totalTicks) * length);
      const next = TAGLINE_RED.split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealCount) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      setTaglineDisplay(next);

      if (tick >= totalTicks) {
        if (taglineIntervalRef.current) clearInterval(taglineIntervalRef.current);
        setTaglineDisplay(TAGLINE_RED);
      }
    }, tickMs);
  }

  function typewriterTagline(durationMs: number) {
    if (taglineIntervalRef.current) clearInterval(taglineIntervalRef.current);
    const length = TAGLINE_BLUE.length;
    const charDelay = Math.max(15, Math.min(45, durationMs / length));
    let i = 0;
    setTaglineDisplay("");

    taglineIntervalRef.current = setInterval(() => {
      i++;
      setTaglineDisplay(TAGLINE_BLUE.slice(0, i));
      if (i >= length && taglineIntervalRef.current) {
        clearInterval(taglineIntervalRef.current);
      }
    }, charDelay);
  }

  useEffect(() => {
    if (shouldReduceMotion) return;

    let burstCount = 0;

    function scheduleNext() {
      const delay = 4000 + Math.random() * 3000;
      timeoutRef.current = setTimeout(() => {
        burstCount++;
        const isBig = burstCount % 4 === 0;
        setSliceTop(15 + Math.random() * 55);
        setBurst(isBig ? "big" : "small");

        if (isRed) {
          scrambleTagline(isBig ? 500 : 280);
        } else {
          typewriterTagline(isBig ? 600 : 320);
        }

        if (isBig && isRed) {
          window.dispatchEvent(new CustomEvent("chat:heroBigBurst"));
        }

        const burstDuration = isBig ? 550 : 220;
        setTimeout(() => setBurst("idle"), burstDuration);

        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (taglineIntervalRef.current) clearInterval(taglineIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRed, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    function handleMouseMove(e: MouseEvent) {
      const el = logoWrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
      const maxTilt = 8;
      el.style.transform = `perspective(900px) rotateX(${(-dy * maxTilt).toFixed(2)}deg) rotateY(${(dx * maxTilt).toFixed(2)}deg)`;
    }

    function handleMouseLeave() {
      const el = logoWrapRef.current;
      if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldReduceMotion]);

  const burstClass = burst === "small" ? "burst-small" : burst === "big" ? "burst-big" : "";

  return (
    <section className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden flex flex-col items-center justify-center px-6">
      {!shouldReduceMotion && isRed && (
        <div className="hero-scanline pointer-events-none absolute inset-0" />
      )}

      <svg width="0" height="0" className="absolute">
        <defs>
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
          <pattern id="hero-grid-pattern" width="9" height="9" patternUnits="userSpaceOnUse">
            <path d="M 9 0 L 0 0 0 9" fill="none" stroke="#d8ecff" strokeWidth="0.9" />
          </pattern>
        </defs>
      </svg>

      <div className="relative flex flex-col items-center">
        {!shouldReduceMotion && isRed && <CircuitTraceBackground />}
        {!shouldReduceMotion && isBlue && (
          <OrbitingSatellites reacting={burst === "big"} />
        )}

        <div ref={logoWrapRef} className={`hero-logo-wrap relative ${burstClass}`}>
          <ChatLogoShape
            className="hero-logo"
            fill={isRed ? "var(--hero-red)" : "var(--hero-blue)"}
          />

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
              <ChatLogoShape className="hero-logo hero-logo-noise" fill="var(--hero-red)" />
              {burst === "big" && <span className="hero-shockwave" />}
            </>
          )}

          {isBlue && !shouldReduceMotion && (
            <>
              <ChatLogoShape className="hero-logo hero-logo-gridlines" fill="#d8ecff" />
              <ChatLogoShape className="hero-logo hero-logo-scan" fill="#eaf6ff" />
              <ChatLogoShape
                className="hero-logo hero-logo-hologram"
                fill="url(#hero-grid-pattern)"
              />
              <ChatLogoShape className="hero-logo hero-logo-authflash" fill="#eaf6ff" />

              <span className="hero-bracket hero-bracket-tl" />
              <span className="hero-bracket hero-bracket-tr" />
              <span className="hero-bracket hero-bracket-bl" />
              <span className="hero-bracket hero-bracket-br" />

              {burst === "big" && (
                <>
                  <span className="hero-ring-confirm hero-ring-confirm-a" />
                  <span className="hero-ring-confirm hero-ring-confirm-b" />
                </>
              )}
            </>
          )}
        </div>

        <p
          className={`mt-6 font-mono text-sm sm:text-base font-bold tracking-[0.3em] ${
            isRed ? "text-[var(--hero-red)]" : "text-[var(--hero-blue)]"
          } ${burst === "big" ? "tagline-flicker" : ""}`}
        >
          {taglineDisplay}
        </p>
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