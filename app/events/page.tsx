"use client";

import { useEffect, useState } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents } from "@/lib/firebase-events";
import { Timeline } from "@/components/events/timeline";

export default function EventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">WHAT WE DO</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Events
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        CTFs, talks, and workshops — click any event for details.
      </p>

      <div className="mt-16">
        <Timeline events={events} />
      </div>
    </section>
  );
}