import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs tracking-wide text-[var(--admin-accent)] mb-3">
        CHAT ADMIN
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-4 text-[var(--admin-foreground)]/60">
        Events and Projects management land here next.
      </p>

      <Link
        href="/admin/team"
        className="mt-8 inline-block font-mono text-sm px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity"
      >
        Manage Team →
      </Link>
    </section>
  );
}