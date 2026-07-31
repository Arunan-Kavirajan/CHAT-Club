"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { THEME_TOKENS } from "@/lib/theme-tokens";
import type { ShatterLayout } from "@/lib/theme-transition/generate-shatter";
import type { Theme } from "./theme-context";

type TransitionKind = "breach" | "patch" | null;

type Props = {
  kind: TransitionKind;
  themes: { leaving: Theme; entering: Theme } | null;
  layout: ShatterLayout | null;
  onMidpoint: () => void;
  onComplete: () => void;
};

// Fast start, decelerating drift — how a shard behaves once it's been
// knocked loose, not a mechanical linear slide.
const SHATTER_EASE = [0.16, 1, 0.3, 1] as const;

// A snap-into-place overshoot curve for Patch — deterministic (a tween,
// not a spring), so its exact finish time can be scheduled precisely
// against the crack-glow and theme swap that follow it.
const PATCH_EASE = [0.34, 1.56, 0.64, 1] as const;

// Patch converges noticeably snappier than Breach shatters — this scales
// every shard's breach duration/delay down for the convergence phase.
const PATCH_SPEED_FACTOR = 0.55;

// Timing constants (seconds).
const CRACK_DRAW_DURATION = 0.24; // breach: crack network draw-in
const LEAD_IN = 0.5; // breach: time for cracks to finish before shattering
const FLASH_DURATION = 0.28; // breach: impact flash
const SEAL_GLOW_DURATION = 0.55; // patch: slow, smooth crack-seal glow
const SEAL_FLASH_DURATION = 0.6; // patch: slow, smooth seal flash
const SEAL_HOLD = 0.15; // patch: brief hold after the glow finishes
const FADE_DURATION = 0.4; // patch: final clear-away

export function ThemeTransitionOverlay({
  kind,
  themes,
  layout,
  onMidpoint,
  onComplete,
}: Props) {
  const firedMidpoint = useRef(false);
  const firedComplete = useRef(false);

  useEffect(() => {
    if (!kind || !layout) {
      firedMidpoint.current = false;
      firedComplete.current = false;
      return;
    }

    if (kind === "breach") {
      // Cracks draw in, then shards shatter outward. Theme already swapped
      // instantly by theme-context (hidden — shards fully cover the screen
      // at rest, in the leaving color, matching what's already on screen).
      const totalMs = (LEAD_IN + layout.maxShardEnd) * 1000;
      const completeTimer = setTimeout(() => {
        if (!firedComplete.current) {
          firedComplete.current = true;
          onComplete();
        }
      }, totalMs);
      return () => clearTimeout(completeTimer);
    }

    // Patch: shards converge first (deterministic tween, scaled faster
    // than breach) — the real theme swap happens exactly when they
    // finish, so it's hidden under a fully opaque, matching overlay.
    // Then the crack network glows/seals, then everything fades away.
    const convergeSeconds = layout.maxShardEnd * PATCH_SPEED_FACTOR;
    const convergeMs = convergeSeconds * 1000;
    const midpointTimer = setTimeout(() => {
      if (!firedMidpoint.current) {
        firedMidpoint.current = true;
        onMidpoint();
      }
    }, convergeMs);

    const totalMs =
      (convergeSeconds + SEAL_GLOW_DURATION + SEAL_HOLD + FADE_DURATION) *
      1000;
    const completeTimer = setTimeout(() => {
      if (!firedComplete.current) {
        firedComplete.current = true;
        onComplete();
      }
    }, totalMs);

    return () => {
      clearTimeout(midpointTimer);
      clearTimeout(completeTimer);
    };
  }, [kind, layout, onMidpoint, onComplete]);

  if (!kind || !themes || !layout) return null;

  const leavingColor = THEME_TOKENS[themes.leaving].background;
  const enteringColor = THEME_TOKENS[themes.entering].background;
  const glowColor = THEME_TOKENS[themes.entering].accent;

  // Breach: shards colored as the theme being left (something breaking).
  // Patch: shards colored as the theme arriving (protection arriving).
  const shardColor = kind === "breach" ? leavingColor : enteringColor;

  // Patch converges faster than breach shatters — sealStart is scaled
  // down to match, and used directly (no extra buffer) so the crack glow
  // begins the instant convergence visually finishes, not after a gap.
  const sealStart = kind === "patch" ? layout.maxShardEnd * PATCH_SPEED_FACTOR : 0;
  const crackCycleDuration =
    kind === "breach"
      ? LEAD_IN + 0.18
      : sealStart + SEAL_GLOW_DURATION + SEAL_HOLD + FADE_DURATION;

  const shardLayer = layout.shards.map((shard) =>
    kind === "breach" ? (
      <motion.div
        key={shard.id}
        initial={{ x: "0%", y: "0%", rotate: 0 }}
        animate={{
          x: `${shard.translateX}%`,
          y: `${shard.translateY}%`,
          rotate: shard.rotate,
        }}
        transition={{
          duration: shard.duration,
          delay: LEAD_IN + shard.delay,
          ease: SHATTER_EASE,
        }}
        className="absolute inset-0"
        style={{ backgroundColor: shardColor, clipPath: shard.clipPath }}
      />
    ) : (
      <motion.div
        key={shard.id}
        initial={{
          x: `${shard.translateX}%`,
          y: `${shard.translateY}%`,
          rotate: shard.rotate,
        }}
        animate={{ x: "0%", y: "0%", rotate: 0 }}
        transition={{
          // Deterministic tween (not spring) — its exact finish time is
          // known in advance, so the crack glow that follows can be
          // scheduled to start the instant convergence actually ends.
          duration: shard.duration * PATCH_SPEED_FACTOR,
          delay: shard.delay * PATCH_SPEED_FACTOR,
          ease: PATCH_EASE,
        }}
        className="absolute inset-0"
        style={{ backgroundColor: shardColor, clipPath: shard.clipPath }}
      />
    ),
  );

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
      {kind === "patch" ? (
        // Patch shards converge (children), then the whole group fades
        // together (parent) once sealed, revealing the real page.
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{
            duration: crackCycleDuration,
            times: [
              0,
              (sealStart + SEAL_GLOW_DURATION + SEAL_HOLD) / crackCycleDuration,
              1,
            ],
          }}
        >
          {shardLayer}
        </motion.div>
      ) : (
        shardLayer
      )}

      {/* Crack-line network */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      >
        <motion.g
          initial={{ opacity: kind === "breach" ? 1 : 0 }}
          animate={
            kind === "breach"
              ? { opacity: [1, 1, 0] }
              : { opacity: [0, 1, 1, 0] }
          }
          transition={
            kind === "breach"
              ? {
                  duration: crackCycleDuration,
                  times: [0, LEAD_IN / crackCycleDuration, 1],
                }
              : {
                  duration: crackCycleDuration,
                  times: [
                    0,
                    sealStart / crackCycleDuration,
                    (sealStart + SEAL_GLOW_DURATION + SEAL_HOLD) /
                      crackCycleDuration,
                    1,
                  ],
                }
          }
        >
          {layout.cracks.map((crack) => (
            <motion.line
              key={crack.id}
              x1={crack.x1}
              y1={crack.y1}
              x2={crack.x2}
              y2={crack.y2}
              stroke={glowColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={crack.length}
              initial={{ strokeDashoffset: crack.length }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: kind === "breach" ? CRACK_DRAW_DURATION : SEAL_GLOW_DURATION,
                delay: (kind === "breach" ? 0 : sealStart) + crack.drawDelay,
                ease: kind === "breach" ? "easeOut" : "easeInOut",
              }}
            />
          ))}
        </motion.g>
      </svg>

      {/* Impact / seal flash */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0, 1.6, 2.2] }}
        transition={{
          duration: kind === "breach" ? FLASH_DURATION : SEAL_FLASH_DURATION,
          delay: kind === "breach" ? LEAD_IN - 0.04 : sealStart,
          ease: kind === "breach" ? "easeOut" : "easeInOut",
        }}
        className="absolute w-[60vmax] h-[60vmax] rounded-full"
        style={{
          left: "50%",
          top: "50%",
          marginLeft: "-30vmax",
          marginTop: "-30vmax",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}