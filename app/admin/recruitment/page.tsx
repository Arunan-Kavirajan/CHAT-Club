"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { subscribeRecruitment, saveRecruitment, type RecruitmentSettings } from "@/lib/firebase-recruitment";

export default function AdminRecruitmentPage() {
  const [settings, setSettings] = useState<RecruitmentSettings>({ open: false, formUrl: "" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const unsub = subscribeRecruitment(setSettings);
    return () => unsub();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSavedMsg(false);
    await saveRecruitment(settings);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  }

  return (
    <div>
      <AdminHeader title="RECRUITMENT" backHref="/admin" />

      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Recruitment</h1>
        <p className="mt-2 text-[var(--admin-foreground)]/60">
          Controls the Join button on the public site.
        </p>

        <div className="mt-10 rounded-lg border border-[var(--admin-accent-soft)] p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recruitment status</p>
              <p className="font-mono text-xs text-[var(--admin-foreground)]/50 mt-1">
                {settings.open ? "Open — Join button is visible" : "Closed — no Join button shown"}
              </p>
            </div>
            <button
              onClick={() => setSettings((s) => ({ ...s, open: !s.open }))}
              className="relative w-14 h-8 rounded-full transition-colors"
              style={{
                backgroundColor: settings.open ? "var(--admin-accent)" : "var(--admin-muted)",
              }}
              aria-label="Toggle recruitment status"
            >
              <span
                className="absolute top-1 w-6 h-6 rounded-full bg-white transition-all"
                style={{ left: settings.open ? "calc(100% - 28px)" : "4px" }}
              />
            </button>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-[var(--admin-foreground)]/50">
              Google Form URL
            </span>
            <input
              value={settings.formUrl}
              onChange={(e) => setSettings((s) => ({ ...s, formUrl: e.target.value }))}
              placeholder="https://forms.gle/..."
              className="admin-input"
              disabled={!settings.open}
            />
            {settings.open && !settings.formUrl.trim() && (
              <span className="font-mono text-xs text-[var(--admin-accent)]">
                Recruitment is open but no form link is set — the Join
                button will not appear until one is added.
              </span>
            )}
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="font-mono text-xs px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {savedMsg && (
              <span className="font-mono text-xs text-[var(--admin-accent)]">Saved.</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}