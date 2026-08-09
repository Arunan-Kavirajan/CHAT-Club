"use client";

import { useTheme } from "@/components/theme/theme-context";

/**
 * Shared hover-reveal effect for Events + Gallery cards. Branches
 * visually on theme (same reusable component, not two separate ones):
 * Red gets a glitch-tinted scan sweep + slice flash, Blue gets a scan
 * sweep + holographic grid-flicker + expanding ping. Pure CSS via
 * group-hover — the parent card button already has the `group` class.
 */
export function CardScanEffect() {
  const { theme } = useTheme();
  const isRed = theme === "dark";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="card-scan-line" />
      {isRed ? (
        <>
          <div className="card-tint-flash" />
          <div className="card-glitch-slice" />
        </>
      ) : (
        <>
          <div className="card-grid-overlay" />
          <div className="card-ping" />
        </>
      )}
    </div>
  );
}