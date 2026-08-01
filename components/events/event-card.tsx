"use client";

import { useState } from "react";
import type { AdminEvent } from "@/lib/event-types";

function getStatus(dateStr: string): "upcoming" | "past" | "unknown" {
  if (!dateStr) return "unknown";
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today ? "upcoming" : "past";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "Date TBA";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function EventCard({ event }: { event: AdminEvent }) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(event.date);

  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
          status === "past" ? "border-foreground/30 bg-background" : "border-accent bg-accent"
        }`}
      />

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left rounded-lg border border-foreground/15 hover:border-accent/50 transition-colors overflow-hidden flex"
      >
        <div className="w-28 sm:w-36 shrink-0 bg-muted">
          {event.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-foreground/30">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-1">
            {status !== "unknown" && (
              <span
                className={`font-mono text-[10px] tracking-wide px-1.5 py-0.5 rounded ${
                  status === "upcoming" ? "bg-accent/15 text-accent" : "bg-foreground/10 text-foreground/50"
                }`}
              >
                {status === "upcoming" ? "UPCOMING" : "PAST"}
              </span>
            )}
            <span className="font-mono text-xs text-foreground/50">{formatDate(event.date)}</span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{event.name}</h3>
          {event.location && (
            <p className="text-sm text-foreground/60 mt-0.5">{event.location}</p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-2 rounded-lg border border-foreground/10 bg-muted/30 p-4">
          {event.hosts.length > 0 && (
            <p className="font-mono text-xs text-foreground/50 mb-2">
              Hosted by {event.hosts.join(", ")}
            </p>
          )}
          {event.description && (
            <p className="text-sm text-foreground/70 whitespace-pre-wrap">{event.description}</p>
          )}
        </div>
      )}
    </div>
  );
}