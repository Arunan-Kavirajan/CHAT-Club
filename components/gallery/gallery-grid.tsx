"use client";

import type { AdminEvent } from "@/lib/event-types";
import { GalleryCard } from "./gallery-card";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function GalleryGrid({
  events,
  onOpenEvent,
}: {
  events: AdminEvent[];
  onOpenEvent: (event: AdminEvent) => void;
}) {
  return (
    <ScrollRevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {events.map((event) => (
        <ScrollRevealItem key={event.id}>
          <GalleryCard event={event} onOpen={() => onOpenEvent(event)} />
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}