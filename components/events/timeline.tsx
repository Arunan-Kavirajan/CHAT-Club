import type { AdminEvent } from "@/lib/event-types";
import { EventCard } from "./event-card";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function Timeline({ events }: { events: AdminEvent[] }) {
  if (events.length === 0) {
    return <p className="font-mono text-sm text-foreground/40">Nothing here yet.</p>;
  }

  return (
    <ScrollRevealGroup className="relative flex flex-col gap-6" stagger={0.1}>
      <div className="absolute left-1.5 top-2 bottom-2 w-px bg-foreground/15" />
      {events.map((event) => (
        <ScrollRevealItem key={event.id}>
          <EventCard event={event} />
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}