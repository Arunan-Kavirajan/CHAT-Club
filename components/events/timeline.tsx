import type { ClubEvent } from "@/lib/data/events";
import { EventCard } from "./event-card";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function Timeline({ events }: { events: ClubEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="font-mono text-sm text-foreground/40">
        Nothing here yet.
      </p>
    );
  }

  return (
    <ScrollRevealGroup className="relative flex flex-col gap-12" stagger={0.15}>
      {/* Connecting line — spans the full list, dots in EventCard sit on top */}
      <div className="absolute left-1.5 top-2 bottom-2 w-px bg-foreground/15" />
      {events.map((event) => (
        <ScrollRevealItem key={event.id}>
          <EventCard event={event} />
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}