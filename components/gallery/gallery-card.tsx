"use client";

import type { AdminEvent } from "@/lib/event-types";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function GalleryCard({
  event,
  onOpen,
}: {
  event: AdminEvent;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-muted text-left"
    >
      {event.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.thumbnailUrl}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-foreground/30">
          No thumbnail
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white font-medium text-sm truncate">{event.name}</p>
        {event.date && (
          <p className="text-white/70 font-mono text-xs">{formatDate(event.date)}</p>
        )}
      </div>
    </button>
  );
}