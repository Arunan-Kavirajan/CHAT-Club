"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents } from "@/lib/firebase-events";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function GalleryPreview() {
  const [events, setEvents] = useState<AdminEvent[]>([]);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const photos = events.flatMap((e) => e.photoUrls).slice(0, 6);

  // Nothing to preview yet — skip the section entirely rather than
  // showing an empty/broken-looking strip.
  if (photos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-foreground/10">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <p className="font-mono text-sm text-accent mb-2">MOMENTS</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            <HoverScramble>Recent Moments</HoverScramble>
          </h2>
        </div>
        <Link
          href="/gallery"
          className="font-mono text-sm text-foreground/50 hover:text-accent transition-colors whitespace-nowrap"
        >
          <HoverScramble>View Gallery →</HoverScramble>
        </Link>
      </div>

      <ScrollRevealGroup className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {photos.map((url, i) => (
          <ScrollRevealItem key={i}>
            <div className="aspect-square rounded-md overflow-hidden bg-muted group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>
    </section>
  );
}