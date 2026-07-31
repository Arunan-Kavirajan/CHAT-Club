"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ThemeTransitionOverlay } from "./theme-transition-overlay";
import {
  generateShatterLayout,
  type ShatterLayout,
} from "@/lib/theme-transition/generate-shatter";

export type Theme = "dark" | "light";

export const THEME_LABELS: Record<Theme, string> = {
  dark: "Red Team",
  light: "Blue Team",
};

const STORAGE_KEY = "chat-theme";
const DEFAULT_THEME: Theme = "dark";

type TransitionKind = "breach" | "patch" | null;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  const [transitionKind, setTransitionKind] = useState<TransitionKind>(null);
  const [transitionThemes, setTransitionThemes] = useState<{
    leaving: Theme;
    entering: Theme;
  } | null>(null);
  const [transitionLayout, setTransitionLayout] =
    useState<ShatterLayout | null>(null);
  const pendingThemeRef = useRef<Theme | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external system (localStorage) on mount, the blessed use case for this pattern
      setThemeState(stored);
    }
  }, []);

  function commitThemeChange(next: Theme) {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  }

  const setTheme = (next: Theme) => commitThemeChange(next);

  const toggleTheme = () => {
    if (transitionKind) return;

    const next: Theme = theme === "dark" ? "light" : "dark";
    const kind: TransitionKind = theme === "light" ? "breach" : "patch";

    setTransitionThemes({ leaving: theme, entering: next });
    setTransitionKind(kind);
    setTransitionLayout(
      generateShatterLayout(window.innerWidth, window.innerHeight),
    );

    if (kind === "breach") {
      commitThemeChange(next);
    } else {
      pendingThemeRef.current = next;
    }
  };

  const handleMidpoint = () => {
    if (pendingThemeRef.current) {
      commitThemeChange(pendingThemeRef.current);
      pendingThemeRef.current = null;
    }
  };

  const handleTransitionComplete = () => {
    setTransitionKind(null);
    setTransitionThemes(null);
    setTransitionLayout(null);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
      <ThemeTransitionOverlay
        kind={transitionKind}
        themes={transitionThemes}
        layout={transitionLayout}
        onMidpoint={handleMidpoint}
        onComplete={handleTransitionComplete}
      />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}