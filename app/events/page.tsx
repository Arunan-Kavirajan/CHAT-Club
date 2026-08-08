"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents } from "@/lib/firebase-events";
import { getEventStatus, sortByDateAsc, sortByDateDesc } from "@/lib/event-status";
import { EventGridCard } from "@/components/events/event-card-grid";
import { EventModal } from "@/components/events/event-modal";
import { ScrollProgressBar } from "@/components/events/scroll-progress-bar";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export default function EventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<AdminEvent | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const { live, upcoming, archived } = useMemo(() => {
    const live: AdminEvent[] = [];
    const upcoming: AdminEvent[] = [];
    const archived: AdminEvent[] = [];
    for (const e of events) {
      const status = getEventStatus(e.date);
      if (status === "live") live.push(e);
      else if (status === "upcoming") upcoming.push(e);
      else archived.push(e);
    }
    return {
      live,
      upcoming: sortByDateAsc(upcoming),
      archived: sortByDateDesc(archived),
    };
  }, [events]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <ScrollProgressBar />

      <p className="font-mono text-sm text-accent mb-4">WHAT WE DO</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        <HoverScramble>Operation Logs</HoverScramble>
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        Explore our latest briefings and scheduled engagements.
        <br />Select any entry to view active intelligence and join upcoming operations.
      </p>

      {events.length === 0 && (
        <p className="mt-16 font-mono text-sm text-foreground/40">Nothing here yet.</p>
      )}

      {live.length > 0 && (
        <div className="mt-16">
          <h2 className="font-mono text-sm tracking-[0.3em] text-accent mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            LIVE NOW
          </h2>
          <ScrollRevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {live.map((event) => (
              <ScrollRevealItem key={event.id}>
                <EventGridCard event={event} status="live" onOpen={() => setActiveEvent(event)} />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mt-16">
          <h2 className="font-mono text-sm tracking-[0.3em] text-foreground/50 mb-6">
            UPCOMING
          </h2>
          <ScrollRevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <ScrollRevealItem key={event.id}>
                <EventGridCard
                  event={event}
                  status="upcoming"
                  onOpen={() => setActiveEvent(event)}
                />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      )}

      {archived.length > 0 && (
        <div className="mt-16">
          <h2 className="font-mono text-sm tracking-[0.3em] text-foreground/50 mb-6">
            ARCHIVED
          </h2>
          <ScrollRevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {archived.map((event) => (
              <ScrollRevealItem key={event.id}>
                <EventGridCard
                  event={event}
                  status="archived"
                  onOpen={() => setActiveEvent(event)}
                />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      )}

      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
}