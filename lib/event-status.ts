import type { AdminEvent } from "@/lib/event-types";

export type EventStatus = "live" | "upcoming" | "archived";

export function getEventStatus(dateStr: string): EventStatus {
  if (!dateStr) return "upcoming";
  const eventDate = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) return "live";
  return eventDate > today ? "upcoming" : "archived";
}

export function sortByDateAsc(events: AdminEvent[]) {
  return [...events].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

export function sortByDateDesc(events: AdminEvent[]) {
  return [...events].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function formatEventDate(dateStr: string) {
  if (!dateStr) return "DATE TBA";
  return new Date(`${dateStr}T00:00:00`)
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    .toUpperCase();
}