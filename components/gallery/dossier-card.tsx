"use client";

import { useState } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { formatDossierDate } from "@/lib/gallery-format";
import { CardScanEffect } from "@/components/ui/card-scan-effect";
import { CyberCardCorners } from "@/components/ui/cyber-card-corners";
import { useIsTouchDevice } from "@/lib/hooks/use-touch-hover";

export function DossierCard({
  event,
  onOpen,
}: {
  event: AdminEvent;
  onOpen: () => void;
}) {
  const [touchActive, setTouchActive] = useState(false);
  const isTouch = useIsTouchDevice();

  function handleClick() {
    if (isTouch) {
      setTouchActive(true);
      setTimeout(() => setTouchActive(false), 500);
    }
    onOpen();
  }

  return (
    <button
      onClick={handleClick}
      className={`cyber-card-hover group relative text-left w-full rounded-xl border border-foreground/15 bg-muted overflow-hidden cursor-pointer ${touchActive ? "is-touch-active" : ""}`}
    >
      <div className="relative h-56 overflow-hidden bg-muted">
        {event.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-foreground/30">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute top-3 right-3 font-mono text-[10px] tracking-wider px-2 py-1 rounded bg-black/60 text-white backdrop-blur-sm">
          [ {event.photoUrls.length} PHOTOS ]
        </span>
        <CardScanEffect />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-mono font-bold text-base leading-snug">{event.name}</h3>
        <p className="font-mono text-xs text-foreground/50">
          {formatDossierDate(event.date, event.location)}
        </p>
        <p className="font-mono text-xs text-accent text-right mt-1">[ ACCESS ALBUM → ]</p>
      </div>

      <CyberCardCorners />
    </button>
  );
}