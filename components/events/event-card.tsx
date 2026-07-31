import type { ClubEvent } from "@/lib/data/events";

export function EventCard({ event }: { event: ClubEvent }) {
  const isPast = event.status === "past";

  return (
    <div className="relative pl-10">
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
          isPast
            ? "border-foreground/30 bg-background"
            : "border-accent bg-accent"
        }`}
      />

      <p className="font-mono text-xs tracking-wide text-foreground/50 mb-1.5">
        {event.date}
      </p>
      <h3
        className={`text-xl font-semibold tracking-tight ${
          isPast ? "text-foreground/70" : ""
        }`}
      >
        {event.title}
      </h3>
      <p className="mt-1.5 text-foreground/70 max-w-md">
        {event.description}
      </p>
    </div>
  );
}