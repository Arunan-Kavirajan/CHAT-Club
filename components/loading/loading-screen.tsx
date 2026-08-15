"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LogoMaterialize } from "./logo-materialize";
import { AmbientParticles } from "./ambient-particles";

const ASSEMBLE_MS = 1700;
const REDUCED_MS = 700;
const IGNITE_HOLD_MS = 400;
const REVEAL_MS = 650;
const REDUCED_REVEAL_MS = 350;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [ignite, setIgnite] = useState(false);
  const [collapsing, setCollapsing] = useState(false);

  useEffect(() => {
    const duration = shouldReduceMotion ? REDUCED_MS : ASSEMBLE_MS;
    let start: number | null = null;
    let raf: number;

    function tick(now: number) {
      if (start === null) start = now;
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setIgnite(true);
        const revealMs = shouldReduceMotion ? REDUCED_REVEAL_MS : REVEAL_MS;
        setTimeout(() => setCollapsing(true), IGNITE_HOLD_MS);
        setTimeout(onComplete, IGNITE_HOLD_MS + revealMs);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  const revealStyle = shouldReduceMotion
    ? {
        opacity: collapsing ? 0 : 1,
        transition: `opacity ${REDUCED_REVEAL_MS}ms ease-out`,
      }
    : {
        clipPath: collapsing ? "circle(0% at 19% 50%)" : "circle(150% at 19% 50%)",
        transition: `clip-path ${REVEAL_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      };

  return (
    <motion.div
      className="boot-loader-wrapper fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center gap-8"
      style={revealStyle}
    >
      <AmbientParticles reduced={shouldReduceMotion ?? undefined} />

      <LogoMaterialize ignite={ignite} reduced={shouldReduceMotion ?? undefined} />

      <div className="flex flex-col items-center gap-2 relative z-10">
        <p className="font-mono text-xs sm:text-sm tracking-[0.3em] text-purple-300">
          {ignite ? "SYSTEMS SYNCHRONIZED" : "ASSEMBLING SYSTEM"}
        </p>
        <div className="h-0.5 w-56 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #ff2e46, #a855f7, #38bdf8)",
              boxShadow: "0 0 10px rgba(168,85,247,0.8)",
              transition: "width 80ms linear",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}