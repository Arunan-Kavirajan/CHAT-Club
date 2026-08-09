"use client";

import { useEffect, useState } from "react";
import { EventDialog } from "@/components/admin/events/event-dialog";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useConfirm } from "@/lib/hooks/use-confirm";
import type { AdminEvent } from "@/lib/event-types";
import { subscribeEvents, saveEvent, deleteEventDoc } from "@/lib/firebase-events";
import { deleteImageFromGithub, deleteFolderFromGithub } from "@/lib/github-upload";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const { confirm, confirmProps, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  async function handleDelete(event: AdminEvent) {
    const ok = await confirm({
      title: "Delete event?",
      message: `Delete "${event.name}"? This also permanently deletes its thumbnail and all ${event.photoUrls.length} event photo(s) from GitHub.\n\nThis can't be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    deleteEventDoc(event.id);
    if (event.thumbnailUrl) {
      deleteImageFromGithub(event.thumbnailUrl);
    }
    if (event.folderSlug) {
      deleteFolderFromGithub(`event-photos/${event.folderSlug}`);
    }
  }

  return (
    <div>
      <AdminHeader title="EVENTS" backHref="/admin" />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
        <p className="mt-2 text-[var(--admin-foreground)]/60">
          Manage events shown on the public Events page. Changes are live.
        </p>

        <div className="mt-8 rounded-lg border border-[var(--admin-accent-soft)] p-6">
          <div className="flex justify-end mb-4">
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

          <div className="flex flex-col gap-2">
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
                      {event.time ? ` · ${event.time}` : ""}
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
        </div>

        <EventDialog
          open={dialogOpen}
          initialData={editingEvent}
          onClose={() => setDialogOpen(false)}
          onSave={saveEvent}
        />

        <ConfirmDialog
          open={!!confirmProps}
          title={confirmProps?.title ?? ""}
          message={confirmProps?.message ?? ""}
          confirmLabel={confirmProps?.confirmLabel}
          danger={confirmProps?.danger}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}