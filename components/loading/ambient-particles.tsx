"use client";

import { useEffect, useState } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    color: Math.random() < 0.5 ? "#ff2e46" : "#38bdf8",
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 3,
  }));
}

export function AmbientParticles({ reduced }: { reduced?: boolean }) {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    if (reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally client-only random visual data; generating it during render would mismatch between server and client
    setParticles(generateParticles(24));
  }, [reduced]);

  if (reduced || !particles) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="ambient-particle absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}