"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/theme/theme-context";
import { useIsTouchDevice } from "@/lib/hooks/use-touch-hover";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_/[]{}=+*^?#";

type HoverScrambleProps = {
  /** Plain text only — this can't wrap headings containing nested elements. */
  children: string;
  className?: string;
};

/**
 * Wrap any plain-text heading, subheading, or link label in this to get
 * the theme-aware hover effect: a decrypt-style scramble on Red Team, a
 * typewriter-with-cursor effect on Blue Team. Opt-in per use — never wire
 * this into admin panel text, which is meant to stay outside this system.
 *
 * Important: the typewriter branch renders every character from the start
 * and only toggles opacity as it "reveals" — the box width never changes
 * during the animation. Clearing text to "" and rebuilding it was the
 * original approach, but it shrinks/regrows the hover box, which — since
 * the cursor stays still — eventually regrows back under the pointer and
 * fires a fresh mouseenter, causing an infinite retrigger loop.
 */
export function HoverScramble({ children, className }: HoverScrambleProps) {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();
  const original = children;

  const [scrambleDisplay, setScrambleDisplay] = useState(original);
  const [typedCount, setTypedCount] = useState(original.length);
  const [showCursor, setShowCursor] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    setScrambleDisplay(original);
    setTypedCount(original.length);
  }, [original]);

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  useEffect(() => clearTimers, []);

  function runScramble() {
    const length = original.length;
    // Slower, longer cascade than before — tuned so short text still
    // gets a satisfying number of ticks, long text doesn't drag forever.
    const totalTicks = Math.max(16, Math.min(30, Math.round(length * 1.5)));
    let tick = 0;

    intervalRef.current = setInterval(() => {
      tick++;
      const revealCount = Math.floor((tick / totalTicks) * length);
      const next = original
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealCount) return ch;
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");
      setScrambleDisplay(next);

      if (tick >= totalTicks) {
        clearTimers();
        setScrambleDisplay(original);
        isAnimatingRef.current = false;
        setHighlighted(false);
      }
    }, 55); // was 35ms — slower per-tick pace
  }

  function runTypewriter() {
    const length = original.length;
    // Slower baseline (800ms target vs the old 500ms), same per-char clamp idea.
    const charDelay = Math.max(22, Math.min(60, 800 / length));

    setShowCursor(true);
    setTypedCount(0);
    let i = 0;

    intervalRef.current = setInterval(() => {
      i++;
      setTypedCount(i);

      if (i >= length) {
        clearTimers();
        timeoutRef.current = setTimeout(() => {
          setShowCursor(false);
          isAnimatingRef.current = false;
          setHighlighted(false);
        }, 450);
      }
    }, charDelay);
  }

  function handleMouseEnter() {
    if (shouldReduceMotion || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setHighlighted(true);
    clearTimers();

    if (theme === "dark") {
      runScramble();
    } else {
      runTypewriter();
    }
  }

  function handleTouchStart() {
    if (!isTouch) return;
    handleMouseEnter();
  }

  // Slow fade to the accent color while animating, fading back once done.
  const colorStyle: CSSProperties = {
    color: highlighted ? "var(--accent)" : "inherit",
    transition: "color 1.3s ease",
  };

  if (theme === "dark") {
    return (
      <span className={className} style={colorStyle} onMouseEnter={handleMouseEnter} onTouchStart={handleTouchStart}>
        {scrambleDisplay}
      </span>
    );
  }

  // Blue Team: every character renders from the start (fixed width),
  // only opacity toggles as each one "types in".
  const chars = original.split("");

  return (
    <span className={className} style={colorStyle} onMouseEnter={handleMouseEnter} onTouchStart={handleTouchStart}>
      {chars.map((ch, i) => (
        <span key={i}>
          {i === typedCount && showCursor && (
            // Zero-width overlay — renders visually without adding to
            // the line's width, so it can't cause any layout shift.
            <span
              className="term-cursor"
              style={{ display: "inline-block", width: 0, overflow: "visible" }}
            >
              _
            </span>
          )}
          <span style={{ opacity: i < typedCount ? 1 : 0 }}>{ch}</span>
        </span>
      ))}
      {typedCount === chars.length && showCursor && (
        <span
          className="term-cursor"
          style={{ display: "inline-block", width: 0, overflow: "visible" }}
        >
          _
        </span>
      )}
    </span>
  );
}