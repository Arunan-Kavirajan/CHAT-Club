"use client";

import { useEffect, useState } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents } from "@/lib/firebase-events";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { EventPhotosModal } from "@/components/gallery/event-photos-modal";

export default function GalleryPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const eventsWithPhotos = events.filter((e) => e.photoUrls.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">MOMENTS</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Gallery
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        CTFs, workshops, and everything in between — click an event to see more.
      </p>

      <div className="mt-16">
        {eventsWithPhotos.length === 0 ? (
          <p className="font-mono text-sm text-foreground/40">Nothing here yet.</p>
        ) : (
          <GalleryGrid events={eventsWithPhotos} onOpenEvent={setSelectedEvent} />
        )}
      </div>

      {selectedEvent && (
        <EventPhotosModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}