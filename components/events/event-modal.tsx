"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AdminEvent } from "@/lib/event-types";
import { formatEventDate } from "@/lib/event-status";

export function EventModal({
  event,
  onClose,
}: {
  event: AdminEvent | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-start justify-center overflow-y-auto px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-background rounded-xl border border-foreground/10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-56 sm:h-72 bg-muted">
              {event.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-foreground/30">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 font-mono text-xs px-3 py-1.5 rounded bg-black/60 text-white hover:text-accent transition-colors backdrop-blur-sm"
              >
                [X] CLOSE
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-foreground/10 divide-y sm:divide-y-0 sm:divide-x divide-foreground/10">
              <div className="p-4">
                <p className="font-mono text-[10px] text-foreground/40 tracking-wide mb-1">
                  VENUE / LOCATION
                </p>
                <p className="text-sm">{event.location || "TBA"}</p>
              </div>
              <div className="p-4">
                <p className="font-mono text-[10px] text-foreground/40 tracking-wide mb-1">
                  DATE &amp; TIME
                </p>
                <p className="text-sm font-mono">
                  {formatEventDate(event.date)} &middot; TBA
                </p>
              </div>
              <div className="p-4">
                <p className="font-mono text-[10px] text-foreground/40 tracking-wide mb-1">
                  HOST / OPERATOR
                </p>
                <p className="text-sm">
                  {event.hosts.length > 0 ? event.hosts.join(", ") : "TBA"}
                </p>
              </div>
            </div>

            <div className="p-6 max-h-[40vh] overflow-y-auto">
              <h2 className="text-xl font-semibold tracking-tight mb-3">{event.name}</h2>
              <p className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed">
                {event.description || "No description yet."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}