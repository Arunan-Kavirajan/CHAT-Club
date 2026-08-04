"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Satellite = {
  radius: number;
  size: number;
  duration: number;
  direction: 1 | -1;
  startAngle: number;
};

function generateSatellites(count: number): Satellite[] {
  return Array.from({ length: count }, () => ({
    radius: 70 + Math.random() * 140,
    size: 3 + Math.random() * 3,
    duration: 14 + Math.random() * 16,
    direction: Math.random() < 0.5 ? 1 : -1,
    startAngle: Math.random() * 360,
  }));
}

/**
 * Ambient satellites orbiting the logo — Blue Team's local background,
 * the calm/circular counterpart to Red Team's angular circuit-traces.
 * Generation is deferred to a client-only effect for the same reason as
 * CircuitTraceBackground: Math.random() during render would produce a
 * server/client mismatch.
 */
export function OrbitingSatellites({ reacting }: { reacting: boolean }) {
  const [satellites, setSatellites] = useState<Satellite[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally client-only random visual data; generating it during render would mismatch between server and client
    setSatellites(generateSatellites(6));
  }, []);

  if (!satellites) return null;

  return (
    <div
      className="absolute"
      style={{
        width: "clamp(420px, 95vw, 950px)",
        aspectRatio: "900 / 560",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {satellites.map((sat, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          style={
            {
              animation: `orbit-spin ${sat.duration}s linear infinite`,
              animationDirection: sat.direction === 1 ? "normal" : "reverse",
              "--start-angle": `${sat.startAngle}deg`,
            } as CSSProperties
          }
        >
          <span
            className={`satellite-dot block rounded-full ${reacting ? "satellite-reacting" : ""}`}
            style={
              {
                width: sat.size,
                height: sat.size,
                "--radius": `${sat.radius}px`,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}