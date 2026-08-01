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
  const [user, setUser] = useState<User | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("signed-out");
        return;
      }
      setUser(firebaseUser);
      if (isAuthorizedAdmin(firebaseUser.email)) {
        setStatus("authorized");
      } else {
        // Signed in with the wrong account — kick them out immediately,
        // don't leave an unauthorized session sitting around.
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

  async function handleSignOut() {
    await signOut(auth);
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
    return (
      <div>
        <div className="flex justify-end px-6 pt-4">
          <button
            onClick={handleSignOut}
            className="font-mono text-xs text-[var(--admin-foreground)]/50 hover:text-[var(--admin-accent)] transition-colors"
          >
            Sign out ({user?.email})
          </button>
        </div>
        {children}
      </div>
    );
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
        <p className="font-mono text-xs text-[var(--admin-accent)]">
          {signInError}
        </p>
      )}
    </div>
  );
}