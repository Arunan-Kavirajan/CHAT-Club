export type AdminEvent = {
  id: string;
  name: string;
  date: string; // ISO date string, e.g. "2026-03-14"
  location: string;
  description: string;
  thumbnailUrl: string | null;
  photoUrls: string[];
  hosts: string[];
  // Locked in once at creation (name + short id suffix) and never
  // regenerated on edit — so renaming an event later doesn't disconnect
  // it from photos already uploaded to its event-photos subfolder.
  folderSlug: string | null;
};