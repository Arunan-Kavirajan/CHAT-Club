"use client";

import { useEffect } from "react";
import { ChatLogoShape } from "@/components/home/chat-logo-shape";

const MOBILE_BREAKPOINT = "(max-width: 767px)";
const BYPASS_KEY = "chat-mobile-bypass";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MOBILE_BYPASS_KEY;

export function MobileGate() {
  // One-time bypass link: yoursite.com/?access=<your secret token>
  // Sets a permanent flag on this browser so future visits skip the
  // gate entirely, without needing the link again.
  useEffect(() => {
    if (!ACCESS_TOKEN) return;
    const params = new URLSearchParams(window.location.search);
    const provided = params.get("access");
    if (provided === ACCESS_TOKEN) {
      localStorage.setItem(BYPASS_KEY, "1");
      document.documentElement.setAttribute("data-mobile-bypass", "1");
      params.delete("access");
      const query = params.toString();
      const newUrl =
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);

    function applyLock(isMobile: boolean) {
      const bypassed = document.documentElement.getAttribute("data-mobile-bypass") === "1";
      if (isMobile && !bypassed) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    }

    applyLock(mql.matches);
    function handleChange(e: MediaQueryListEvent) {
      applyLock(e.matches);
    }
    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  return (
    <div
      className="mobile-gate-root admin-scope fixed inset-0 z-[9999] flex md:hidden flex-col items-center justify-center px-8 text-center"
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-foreground)",
        transform: "translateZ(0)",
        touchAction: "none",
        overscrollBehavior: "none",
      }}
    >
      <div className="w-36 sm:w-44 gate-logo-pulse">
        <ChatLogoShape fill="var(--admin-accent)" />
      </div>

      <p className="mt-8 font-mono text-xs tracking-[0.3em] text-[var(--admin-accent)]">
        SYSTEM STATUS
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Optimizing for Desktop
      </h1>
      <p className="mt-4 text-sm text-[var(--admin-foreground)]/60 max-w-xs">
        CHAT&apos;s mobile experience is still being tuned. For now, please
        view this site on a desktop or laptop browser.
      </p>

      <div className="mt-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#d3505f" }} />
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#2f5c88" }} />
      </div>
      <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-[var(--admin-foreground)]/40">
        RED TEAM &middot; BLUE TEAM
      </p>
    </div>
  );
}