"use client";

import { useEffect, useState } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents } from "@/lib/firebase-events";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function padToMin<T>(arr: T[], min: number): T[] {
  if (arr.length === 0) return arr;
  const result = [...arr];
  while (result.length < min) result.push(...arr);
  return result;
}

export function PhotoMarquee() {
  const [rowA, setRowA] = useState<string[] | null>(null);
  const [rowB, setRowB] = useState<string[] | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents((events: AdminEvent[]) => {
      const allPhotos = events.flatMap((e) => e.photoUrls);
      if (allPhotos.length === 0) {
        setRowA([]);
        setRowB([]);
        return;
      }
      const shuffled = shuffle(allPhotos);
      const mid = Math.ceil(shuffled.length / 2);
      const half1 = shuffled.slice(0, mid);
      const half2 = shuffled.slice(mid).length ? shuffled.slice(mid) : shuffled;
      setRowA(padToMin(half1, 10));
      setRowB(padToMin(shuffle(half2), 10));
    });
    return () => unsub();
  }, []);

  if (rowA === null || rowB === null || rowA.length === 0) return null;

  return (
    <section className="py-20 border-t border-foreground/10 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 mb-8">
        <p className="font-mono text-sm text-accent mb-2">MOMENTS</p>
        <h2 className="text-2xl font-bold tracking-tight">Live From The Field</h2>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow photos={rowA} direction="left" />
        <MarqueeRow photos={rowB} direction="right" />
      </div>
    </section>
  );
}

function MarqueeRow({ photos, direction }: { photos: string[]; direction: "left" | "right" }) {
  const doubled = [...photos, ...photos];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-4 w-max ${direction === "left" ? "marquee-left" : "marquee-right"}`}
      >
        {doubled.map((url, i) => (
          <div
            key={i}
            className="w-40 h-28 sm:w-52 sm:h-36 shrink-0 rounded-lg overflow-hidden bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}