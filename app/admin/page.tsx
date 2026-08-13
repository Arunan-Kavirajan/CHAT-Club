import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminHeader title="CHAT ADMIN" backHref="/" backLabel="Back to site" />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 text-[var(--admin-foreground)]/60">
          Manage what appears on the public site.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/team"
            className="group rounded-lg border border-[var(--admin-accent-soft)] bg-[var(--admin-muted)]/30 p-6 hover:border-[var(--admin-accent)] transition-colors"
          >
            <p className="font-mono text-xs text-[var(--admin-accent)] mb-2">01</p>
            <h2 className="text-lg font-semibold group-hover:text-[var(--admin-accent)] transition-colors">
              Team
            </h2>
            <p className="mt-1 text-sm text-[var(--admin-foreground)]/60">
              Categories, teams, and member profiles.
            </p>
          </Link>

          <Link
            href="/admin/events"
            className="group rounded-lg border border-[var(--admin-accent-soft)] bg-[var(--admin-muted)]/30 p-6 hover:border-[var(--admin-accent)] transition-colors"
          >
            <p className="font-mono text-xs text-[var(--admin-accent)] mb-2">02</p>
            <h2 className="text-lg font-semibold group-hover:text-[var(--admin-accent)] transition-colors">
              Events
            </h2>
            <p className="mt-1 text-sm text-[var(--admin-foreground)]/60">
              Upcoming, live, and archived operations.
            </p>
          </Link>

          <Link
            href="/admin/recruitment"
            className="group rounded-lg border border-[var(--admin-accent-soft)] bg-[var(--admin-muted)]/30 p-6 hover:border-[var(--admin-accent)] transition-colors sm:col-span-2"
          >
            <p className="font-mono text-xs text-[var(--admin-accent)] mb-2">03</p>
            <h2 className="text-lg font-semibold group-hover:text-[var(--admin-accent)] transition-colors">
              Recruitment
            </h2>
            <p className="mt-1 text-sm text-[var(--admin-foreground)]/60">
              Open or close applications, set the form link.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}