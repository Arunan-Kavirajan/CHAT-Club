"use client";

import { useEffect, useState } from "react";
import { EventDialog } from "@/components/admin/events/event-dialog";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents, saveEvent, deleteEventDoc } from "@/lib/firebase-events";
import { deleteImageFromGithub, deleteFolderFromGithub } from "@/lib/github-upload";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);

  function handleDelete(event: AdminEvent) {
    deleteEventDoc(event.id);
    if (event.thumbnailUrl) {
      deleteImageFromGithub(event.thumbnailUrl); // best-effort, not blocking
    }
    if (event.folderSlug) {
      deleteFolderFromGithub(`event-photos/${event.folderSlug}`);
    }
  }

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs tracking-wide text-[var(--admin-accent)] mb-3">CHAT ADMIN</p>
      <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
      <p className="mt-2 text-[var(--admin-foreground)]/60">
        Manage events shown on the public Events page. Changes are live.
      </p>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            setEditingEvent(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity"
        >
          + Add event
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {events.length === 0 && (
          <p className="font-mono text-xs text-[var(--admin-foreground)]/40">
            No events yet.
          </p>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg border border-[var(--admin-accent-soft)] bg-[var(--admin-muted)]/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded overflow-hidden bg-[var(--admin-muted)] flex items-center justify-center shrink-0">
                {event.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono text-xs text-[var(--admin-foreground)]/40">—</span>
                )}
              </div>
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="font-mono text-xs text-[var(--admin-foreground)]/50">
                  {event.date || "No date"}
                  {event.location ? ` · ${event.location}` : ""}
                  {event.photoUrls.length > 0 ? ` · ${event.photoUrls.length} photos` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingEvent(event);
                  setDialogOpen(true);
                }}
                className="font-mono text-xs text-[var(--admin-foreground)]/50 hover:text-[var(--admin-accent)] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event)}
                className="font-mono text-xs text-[var(--admin-foreground)]/50 hover:text-[var(--admin-accent)] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <EventDialog
        open={dialogOpen}
        initialData={editingEvent}
        onClose={() => setDialogOpen(false)}
        onSave={saveEvent}
      />
    </section>
  );
}