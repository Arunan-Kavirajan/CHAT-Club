"use client";

import { useEffect, useState } from "react";

type Trace = {
  d: string;
  duration: number;
  delay: number;
};

function generateTraces(count: number, boxW: number, boxH: number): Trace[] {
  const cx = boxW / 2;
  const cy = boxH / 2;
  const innerRx = boxW * 0.22;
  const innerRy = boxH * 0.22;

  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + (Math.random() - 0.5) * 18;
    const rad = (angle * Math.PI) / 180;

    const outerX = cx + Math.cos(rad) * (boxW / 2 - 4);
    const outerY = cy + Math.sin(rad) * (boxH / 2 - 4);
    const innerX = cx + Math.cos(rad) * innerRx;
    const innerY = cy + Math.sin(rad) * innerRy;

    const midX = outerX;
    const midY = innerY;

    const d = `M ${outerX.toFixed(1)} ${outerY.toFixed(1)} L ${midX.toFixed(1)} ${midY.toFixed(1)} L ${innerX.toFixed(1)} ${innerY.toFixed(1)}`;

    return {
      d,
      duration: 2.2 + Math.random() * 2,
      delay: -(Math.random() * 4),
    };
  });
}

const BOX_W = 900;
const BOX_H = 560;

/**
 * Ambient circuit-trace halo around the hero logo. Trace generation is
 * randomized and must only happen client-side — generating it during
 * render would run once on the server and again during client hydration,
 * producing two different results and a hydration mismatch. Deferring to
 * useEffect guarantees it only ever runs in the browser, once, after mount.
 */
export function CircuitTraceBackground() {
  const [traces, setTraces] = useState<Trace[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally client-only random visual data; generating it during render would mismatch between server and client
    setTraces(generateTraces(9, BOX_W, BOX_H));
  }, []);

  if (!traces) return null;

  return (
    <svg
      viewBox={`0 0 ${BOX_W} ${BOX_H}`}
      className="absolute pointer-events-none"
      style={{
        width: "clamp(420px, 95vw, 950px)",
        aspectRatio: `${BOX_W} / ${BOX_H}`,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {traces.map((trace, i) => (
        <g key={i}>
          <path
            d={trace.d}
            fill="none"
            stroke="var(--hero-red)"
            strokeWidth={1}
            strokeDasharray="3 4"
            opacity={0.18}
          />
          <circle r={2.2} fill="var(--hero-red)" opacity={0.9}>
            <animateMotion
              path={trace.d}
              dur={`${trace.duration}s`}
              begin={`${trace.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}