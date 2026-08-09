"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAdminUser } from "@/lib/hooks/use-admin-user";

export function AdminHeader({
  title,
  backHref,
  backLabel = "Back",
}: {
  title: string;
  backHref: string;
  backLabel?: string;
}) {
  const user = useAdminUser();

  return (
    <div className="border-b border-[var(--admin-accent-soft)]">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link
          href={backHref}
          className="font-mono text-xs text-[var(--admin-foreground)]/60 hover:text-[var(--admin-accent)] transition-colors flex items-center gap-1.5"
        >
          ← {backLabel}
        </Link>

        <p className="font-mono text-xs tracking-wide text-[var(--admin-accent)]">{title}</p>

        <button
          onClick={() => signOut(auth)}
          className="font-mono text-xs text-[var(--admin-foreground)]/40 hover:text-[var(--admin-accent)] transition-colors truncate max-w-[160px]"
          title={user?.email ?? ""}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}