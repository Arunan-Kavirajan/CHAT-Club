"use client";

import { useEffect, useState } from "react";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { subscribeRecruitment, type RecruitmentSettings } from "@/lib/firebase-recruitment";

export default function JoinPage() {
  const [settings, setSettings] = useState<RecruitmentSettings | null>(null);

  useEffect(() => {
    const unsub = subscribeRecruitment(setSettings);
    return () => unsub();
  }, []);

  const isOpen = settings?.open && settings.formUrl.trim().length > 0;

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">RECRUITMENT</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
        <HoverScramble>Join the Network</HoverScramble>
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        A cybersecurity club at heart, with room to build across other tech
        too. If that sounds like your kind of place, apply below.
      </p>

      <div className="mt-14 rounded-xl border border-foreground/15 bg-muted/30 p-8 flex flex-col items-center text-center gap-6">
        {settings === null ? (
          <p className="font-mono text-sm text-foreground/40">Checking status...</p>
        ) : isOpen ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs tracking-[0.3em] text-accent">
                [ RECRUITMENT: OPEN ]
              </span>
            </div>

            <p className="text-foreground/70 max-w-sm">
              Applications are currently open. Fill out the form and we will
              be in touch.
            </p>

            <a
              href={settings.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm px-6 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
            >
              <HoverScramble>Apply Now →</HoverScramble>
            </a>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground/30" />
              <span className="font-mono text-xs tracking-[0.3em] text-foreground/50">
                [ RECRUITMENT: CLOSED ]
              </span>
            </div>

            <p className="text-foreground/70 max-w-sm">
              Recruitment is currently closed. Check back soon, or follow us
              on our socials for updates on when applications reopen.
            </p>
          </>
        )}
      </div>
    </section>
  );
}