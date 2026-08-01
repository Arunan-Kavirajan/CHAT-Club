import type { ReactNode } from "react";
import { AuthGate } from "@/components/admin/auth-gate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="admin-scope min-h-screen"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-foreground)",
      }}
    >
      <AuthGate>{children}</AuthGate>
    </div>
  );
}