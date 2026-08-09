import type { AdminEvent } from "@/lib/event-types";
import type { EventStatus } from "@/lib/event-status";
import { CyberCardCorners } from "@/components/ui/cyber-card-corners";
import { CardScanEffect } from "@/components/ui/card-scan-effect";
import { formatEventDate, formatEventTime } from "@/lib/event-status";

const STATUS_LABEL: Record<EventStatus, string> = {
  live: "LIVE",
  upcoming: "UPCOMING",
  archived: "ARCHIVED",
};

export function EventGridCard({
  event,
  status,
  onOpen,
}: {
  event: AdminEvent;
  status: EventStatus;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="cyber-card-hover group relative text-left w-full rounded-xl border border-foreground/10 bg-muted overflow-hidden flex flex-col"
    >
      <div className="relative h-[200px] w-full overflow-hidden bg-muted shrink-0">
        {event.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-foreground/30">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span
          className={`absolute top-3 right-3 font-mono text-[10px] tracking-wider px-2 py-1 rounded flex items-center ${
            status === "live" ? "bg-accent text-background" : "bg-black/60 text-white backdrop-blur-sm"
          }`}
        >
          {status === "live" && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-background mr-1.5 animate-pulse" />
          )}
          [{STATUS_LABEL[status]}]
        </span>
        <CardScanEffect />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-base leading-snug line-clamp-2">{event.name}</h3>

        {event.hosts.length > 0 && (
          <p className="font-mono text-xs text-foreground/50">
            HOST: {event.hosts.join(", ")}
          </p>
        )}

        {event.location && (
          <p className="font-mono text-xs text-foreground/50">@ {event.location}</p>
        )}

        <p className="font-mono text-xs text-accent mt-1">
          {formatEventDate(event.date)} &middot; {formatEventTime(event.time)}
        </p>
      </div>

      <CyberCardCorners />
    </button>
  );
}