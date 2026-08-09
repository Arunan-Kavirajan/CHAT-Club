"use client";

import { useEffect, useState } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents } from "@/lib/firebase-events";
import { DossierCard } from "@/components/gallery/dossier-card";
import { AlbumLightbox } from "@/components/gallery/album-lightbox";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export default function GalleryPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<AdminEvent | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const albums = events.filter((e) => e.photoUrls.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-sm text-accent mb-4">MOMENTS</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
            <HoverScramble>Archive Vault</HoverScramble>
          </h1>
          <p className="mt-5 text-foreground/70 max-w-xl">
            Access verified visual records of past operations. Select any
            mission dossier to unseal the full media archive.
          </p>
        </div>

        <span className="font-mono text-xs tracking-wider px-3 py-1.5 rounded border border-foreground/15 text-foreground/60 whitespace-nowrap">
          [ TOTAL ALBUMS: {albums.length} ]
        </span>
      </div>

      <div className="mt-16">
        {albums.length === 0 ? (
          <p className="font-mono text-sm text-foreground/40">Nothing here yet.</p>
        ) : (
          <ScrollRevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((event) => (
              <ScrollRevealItem key={event.id}>
                <DossierCard event={event} onOpen={() => setActiveAlbum(event)} />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        )}
      </div>

      <AlbumLightbox album={activeAlbum} onClose={() => setActiveAlbum(null)} />
    </section>
  );
}