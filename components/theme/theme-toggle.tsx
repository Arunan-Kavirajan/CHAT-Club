"use client";

import { THEME_LABELS, useTheme } from "./theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="font-mono text-xs tracking-wide px-3 py-1.5 rounded-md border border-foreground/15 hover:border-accent/60 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? THEME_LABELS.light : THEME_LABELS.dark}`}
    >
      {THEME_LABELS[theme]}
    </button>
  );
}
