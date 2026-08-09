"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AdminEvent } from "@/lib/event-types";
import { formatDossierDate } from "@/lib/gallery-format";

export function AlbumLightbox({
  album,
  onClose,
}: {
  album: AdminEvent | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [album]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!album) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, album.photoUrls.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [album, onClose]);

  return (
    <AnimatePresence>
      {album && (
        <motion.div
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div
            className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top nav bar */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h2 className="font-mono font-bold text-sm sm:text-base text-white truncate">
                  {album.name}
                </h2>
                <p className="font-mono text-[11px] text-white/50">
                  {formatDossierDate(album.date, album.location)}
                </p>
              </div>
              <p className="font-mono text-xs text-accent tabular-nums whitespace-nowrap">
                IMG {String(index + 1).padStart(2, "0")} / {album.photoUrls.length}
              </p>
              <button
                onClick={onClose}
                className="font-mono text-xs px-3 py-1.5 rounded bg-white/10 text-white/70 hover:text-accent transition-colors whitespace-nowrap"
              >
                [X] CLOSE ARCHIVE
              </button>
            </div>

            {/* Main viewing canvas */}
            <div className="relative h-[65vh] flex items-center justify-center">
              <button
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                disabled={index === 0}
                className="absolute left-0 sm:-left-4 z-10 font-mono text-2xl text-white/50 hover:text-accent disabled:opacity-20 disabled:hover:text-white/50 transition-colors px-2"
                aria-label="Previous photo"
              >
                ←
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={album.photoUrls[index]}
                  alt=""
                  className="max-h-full max-w-full object-contain rounded-md"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              <button
                onClick={() => setIndex((i) => Math.min(i + 1, album.photoUrls.length - 1))}
                disabled={index === album.photoUrls.length - 1}
                className="absolute right-0 sm:-right-4 z-10 font-mono text-2xl text-white/50 hover:text-accent disabled:opacity-20 disabled:hover:text-white/50 transition-colors px-2"
                aria-label="Next photo"
              >
                →
              </button>
            </div>

            {/* Bottom thumbnail strip */}
            <div className="h-20 flex gap-2 overflow-x-auto p-2 border-t border-white/10 mt-4">
              {album.photoUrls.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setIndex(i)}
                  className={`shrink-0 h-full aspect-square rounded overflow-hidden transition-all ${
                    i === index
                      ? "border-2 border-accent"
                      : "border border-white/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}