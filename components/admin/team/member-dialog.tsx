"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { AdminMember, AdminTeamCategory } from "@/lib/team-types";

type Props = {
  open: boolean;
  categories: AdminTeamCategory[];
  initialData?: AdminMember | null;
  onClose: () => void;
  onSave: (member: Omit<AdminMember, "id"> & { id?: string }) => void;
};

const EMPTY_FORM = {
  name: "",
  categoryId: "",
  teamId: "",
  deptClass: "",
  position: "",
  linkedin: "",
};

export function MemberDialog({ open, categories, initialData, onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        categoryId: initialData.categoryId,
        teamId: initialData.teamId || "",
        deptClass: initialData.deptClass,
        position: initialData.position,
        linkedin: initialData.linkedin,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) return;

    let linkedin = form.linkedin.trim();
    if (linkedin && !/^https?:\/\//i.test(linkedin)) {
      linkedin = `https://${linkedin}`;
    }

    onSave({
      id: initialData?.id,
      name: form.name.trim(),
      categoryId: form.categoryId,
      teamId: form.teamId || null,
      deptClass: form.deptClass.trim(),
      position: form.position.trim(),
      linkedin,
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
        className="w-full max-w-md rounded-lg p-6 bg-[var(--admin-bg)] border border-[var(--admin-accent-soft)]"
        style={{ color: "var(--admin-foreground)" }}
      >
        <h2 className="text-lg font-semibold mb-5">
          {initialData ? "Edit member" : "Add member"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              required
            />
          </Field>

          <Field label="Category">
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value, teamId: "" })}
              className="admin-input"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Team (optional)">
            <select
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              className="admin-input"
              disabled={!selectedCategory || selectedCategory.teams.length === 0}
            >
              <option value="">None</option>
              {selectedCategory?.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Dept & class (e.g. IT-2A)">
            <input
              value={form.deptClass}
              onChange={(e) => setForm({ ...form, deptClass: e.target.value })}
              className="admin-input"
              placeholder="IT-2A"
            />
          </Field>

          <Field label="Position">
            <input
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="admin-input"
              placeholder="President"
            />
          </Field>

          <Field label="LinkedIn URL">
            <input
              type="text"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              className="admin-input"
              placeholder="linkedin.com/in/..."
            />
          </Field>

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
              className="font-mono text-xs px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity"
            >
              {initialData ? "Save changes" : "Add member"}
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