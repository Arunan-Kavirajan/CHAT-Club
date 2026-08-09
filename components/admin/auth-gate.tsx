"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { isAuthorizedAdmin } from "@/lib/admin-config";

type Status = "loading" | "signed-out" | "unauthorized" | "authorized";

export function AuthGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setStatus("signed-out");
        return;
      }
      if (isAuthorizedAdmin(firebaseUser.email)) {
        setStatus("authorized");
      } else {
        signOut(auth);
        setStatus("unauthorized");
      }
    });
    return () => unsubscribe();
  }, []);

  async function handleSignIn() {
    setSignInError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setSignInError("Sign-in failed. Try again.");
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-[var(--admin-foreground)]/50">
          Checking session...
        </p>
      </div>
    );
  }

  if (status === "authorized") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      {status === "unauthorized" && (
        <p className="font-mono text-sm text-[var(--admin-accent)]">
          Unauthorized — that account can&apos;t access this panel.
        </p>
      )}

      <div className="text-center">
        <p className="font-mono text-xs tracking-wide text-[var(--admin-foreground)]/50 mb-2">
          CHAT ADMIN
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-foreground)]">
          Sign in to continue
        </h1>
      </div>

      <button
        onClick={handleSignIn}
        className="font-mono text-sm px-5 py-3 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity"
      >
        Sign in with Google
      </button>

      {signInError && (
        <p className="font-mono text-xs text-[var(--admin-accent)]">{signInError}</p>
      )}
    </div>
  );
}