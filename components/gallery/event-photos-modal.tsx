"use client";

import { useEffect } from "react";
import type { AdminEvent } from "@/lib/event-types";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function EventPhotosModal({
  event,
  onClose,
}: {
  event: AdminEvent;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 flex items-start justify-center overflow-y-auto px-4 py-10"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-background rounded-lg border border-foreground/10"
      >
        <div className="flex items-start justify-between p-6 border-b border-foreground/10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{event.name}</h2>
            <p className="font-mono text-xs text-foreground/50 mt-1">
              {formatDate(event.date)}
              {event.location ? ` · ${event.location}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-sm text-foreground/50 hover:text-accent transition-colors"
          >
            Close ×
          </button>
        </div>

        <div className="p-6">
          {event.photoUrls.length === 0 ? (
            <p className="font-mono text-sm text-foreground/40">No photos yet.</p>
          ) : (
            <div className="columns-2 sm:columns-3 gap-3">
              {event.photoUrls.map((url) => (
                <div key={url} className="break-inside-avoid mb-3 rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}