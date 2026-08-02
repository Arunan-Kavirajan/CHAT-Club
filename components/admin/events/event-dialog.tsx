"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { AdminEvent } from "@/lib/event-types";
import { uploadImageToGithub, deleteImageFromGithub } from "@/lib/github-upload";
import { slugify } from "@/lib/slugify";


type Props = {
  open: boolean;
  initialData?: AdminEvent | null;
  onClose: () => void;
  onSave: (event: AdminEvent) => void;
};

const EMPTY_FORM = {
  name: "",
  date: "",
  location: "",
  description: "",
  thumbnailUrl: "",
  photoUrls: [] as string[],
  hosts: [] as string[],
};

export function EventDialog({ open, initialData, onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [hostInput, setHostInput] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const eventIdRef = useRef<string>(crypto.randomUUID());
  const folderSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        date: initialData.date,
        location: initialData.location,
        description: initialData.description,
        thumbnailUrl: initialData.thumbnailUrl || "",
        photoUrls: initialData.photoUrls,
        hosts: initialData.hosts,
      });
      eventIdRef.current = initialData.id;
      folderSlugRef.current = initialData.folderSlug;
    } else {
      setForm(EMPTY_FORM);
      eventIdRef.current = crypto.randomUUID();
      folderSlugRef.current = null;
    }
    setThumbnailPreview(null);
    setHostInput("");
    setUploadError(null);
  }, [initialData, open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function validateImage(file: File): string | null {
    if (!file.type.startsWith("image/")) return "Please choose an image file.";
    if (file.size > 20 * 1024 * 1024) return "Image must be under 20MB.";
    return null;
  }

  // Locked in once (on first photo upload) and reused for every photo
  // after — never recomputed, even if the event name changes later.
  function getPhotoFolder(): string {
    if (!folderSlugRef.current) {
      folderSlugRef.current = `${slugify(form.name)}-${eventIdRef.current.slice(0, 6)}`;
    }
    return `event-photos/${folderSlugRef.current}`;
  }

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setThumbnailPreview(URL.createObjectURL(file));
    setUploadingThumbnail(true);

    try {
      const previousUrl = form.thumbnailUrl;
      const url = await uploadImageToGithub(file, "thumbnails");
      setForm((prev) => ({ ...prev, thumbnailUrl: url }));
      if (previousUrl && previousUrl !== url) {
        deleteImageFromGithub(previousUrl); // best-effort, not blocking
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
      setThumbnailPreview(null);
    } finally {
      setUploadingThumbnail(false);
    }
  }

  async function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      const error = validateImage(file);
      if (error) {
        setUploadError(`${file.name}: ${error}`);
        return;
      }
    }

    setUploadError(null);
    setUploadingPhotos(true);
    const folder = getPhotoFolder();

    try {
      for (const file of files) {
        const url = await uploadImageToGithub(file, folder);
        setForm((prev) => ({ ...prev, photoUrls: [...prev.photoUrls, url] }));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingPhotos(false);
    }
  }

  function removePhoto(url: string) {
    setForm((prev) => ({ ...prev, photoUrls: prev.photoUrls.filter((p) => p !== url) }));
    deleteImageFromGithub(url); // best-effort, not blocking
  }

  function addHost() {
    const name = hostInput.trim();
    if (!name || form.hosts.includes(name)) return;
    setForm((prev) => ({ ...prev, hosts: [...prev.hosts, name] }));
    setHostInput("");
  }

  function removeHost(name: string) {
    setForm((prev) => ({ ...prev, hosts: prev.hosts.filter((h) => h !== name) }));
  }

  const busy = uploadingThumbnail || uploadingPhotos;
  const thumbnailSrc = thumbnailPreview || form.thumbnailUrl;
  const nameEntered = form.name.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || busy) return;

    onSave({
      id: eventIdRef.current,
      name: form.name.trim(),
      date: form.date,
      location: form.location.trim(),
      description: form.description.trim(),
      thumbnailUrl: form.thumbnailUrl || null,
      photoUrls: form.photoUrls,
      hosts: form.hosts,
      folderSlug: folderSlugRef.current,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg p-6 bg-[var(--admin-bg)] border border-[var(--admin-accent-soft)] max-h-[90vh] overflow-y-auto"
        style={{ color: "var(--admin-foreground)" }}
      >
        <h2 className="text-lg font-semibold mb-5">
          {initialData ? "Edit event" : "Add event"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Event name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              required
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="admin-input"
            />
          </Field>

          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="admin-input"
              placeholder="Room 204, or Online"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input min-h-[90px] resize-y"
            />
          </Field>

          <Field label={nameEntered ? "Thumbnail" : "Thumbnail (enter event name first)"}>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-[var(--admin-muted)] flex items-center justify-center shrink-0">
                {thumbnailSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnailSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono text-xs text-[var(--admin-foreground)]/40">—</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={busy || !nameEntered}
                  className="text-xs text-[var(--admin-foreground)]/60 file:font-mono file:text-xs file:mr-3 file:px-3 file:py-1.5 file:rounded file:border-0 file:bg-[var(--admin-accent)]/20 file:text-[var(--admin-accent)] disabled:opacity-50"
                />
                {uploadingThumbnail && (
                  <span className="font-mono text-xs text-[var(--admin-accent)]">Uploading...</span>
                )}
              </div>
            </div>
          </Field>

          <Field label={nameEntered ? "Event photos" : "Event photos (enter event name first)"}>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                disabled={busy || !nameEntered}
                className="text-xs text-[var(--admin-foreground)]/60 file:font-mono file:text-xs file:mr-3 file:px-3 file:py-1.5 file:rounded file:border-0 file:bg-[var(--admin-accent)]/20 file:text-[var(--admin-accent)] disabled:opacity-50"
              />
              {uploadingPhotos && (
                <span className="font-mono text-xs text-[var(--admin-accent)]">Uploading...</span>
              )}
              {form.photoUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {form.photoUrls.map((url) => (
                    <div key={url} className="relative aspect-square rounded overflow-hidden bg-[var(--admin-muted)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Hosts">
            <div className="flex gap-2">
              <input
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHost();
                  }
                }}
                placeholder="Host name"
                className="admin-input flex-1"
              />
              <button
                type="button"
                onClick={addHost}
                className="font-mono text-xs px-3 py-1.5 rounded bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/30 transition-colors"
              >
                Add
              </button>
            </div>
            {form.hosts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.hosts.map((host) => (
                  <span
                    key={host}
                    className="font-mono text-xs px-2 py-1 rounded bg-[var(--admin-muted)] flex items-center gap-1.5"
                  >
                    {host}
                    <button
                      type="button"
                      onClick={() => removeHost(host)}
                      className="text-[var(--admin-foreground)]/40 hover:text-[var(--admin-accent)]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {uploadError && (
            <p className="font-mono text-xs text-[var(--admin-accent)]">{uploadError}</p>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs px-4 py-2 rounded-md text-[var(--admin-foreground)]/60 hover:text-[var(--admin-foreground)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="font-mono text-xs px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {busy ? "Uploading..." : initialData ? "Save changes" : "Add event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-[var(--admin-foreground)]/50">{label}</span>
      {children}
    </label>
  );
}