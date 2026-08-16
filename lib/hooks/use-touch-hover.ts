"use client";

import { useEffect, useState } from "react";

/**
 * Detects touch-only devices via the standard `(hover: hover) and
 * (pointer: fine)` media query, not user-agent sniffing. Components
 * that drive their "hover" state through JS (not just CSS :hover)
 * use this to also trigger that same state on tap.
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external system (media query) on mount, the blessed use case for this pattern
    setIsTouch(!mql.matches);
    function handleChange(e: MediaQueryListEvent) {
      setIsTouch(!e.matches);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isTouch;
}