"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/theme-context";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme: "light" | "dark";
          callback: (token: string) => void;
          "expired-callback": () => void;
        },
      ) => number;
      reset: (widgetId: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    window.onRecaptchaLoad = () => resolve();
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export type RecaptchaHandle = { reset: () => void };

export function RecaptchaWidget({
  onVerify,
  onExpire,
  widgetRef,
}: {
  onVerify: (token: string) => void;
  onExpire: () => void;
  widgetRef: React.MutableRefObject<RecaptchaHandle | null>;
}) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;

    loadRecaptchaScript().then(() => {
      if (cancelled || !containerRef.current || !window.grecaptcha) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: theme === "dark" ? "dark" : "light",
        callback: onVerify,
        "expired-callback": onExpire,
      });
    });

    widgetRef.current = {
      reset: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      },
    };

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]); // remount + re-render fresh whenever theme changes (key below forces a clean container)

  if (!siteKey) {
    return (
      <p className="font-mono text-xs text-accent">
        reCAPTCHA isn&apos;t configured.
      </p>
    );
  }

  return <div key={theme} ref={containerRef} />;
}