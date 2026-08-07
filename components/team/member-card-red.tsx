"use client";

import { useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import type { AdminMember } from "@/lib/team-types";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_/[]{}=+*^?#";
const IDLE_CLASS_POS = "CLASS: 0x4A // POS: UNKNOWN";

type Phase = "idle" | "hovering" | "leaving";
const LEAVE_DURATION_MS = 420;

export function MemberCardRed({ member }: { member: AdminMember }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sliceTopA, setSliceTopA] = useState(30);
  const [sliceTopB, setSliceTopB] = useState(60);
  const [classPosDisplay, setClassPosDisplay] = useState(IDLE_CLASS_POS);
  const scrambleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHovered = phase === "hovering";
  const realClassPos = `CLASS: ${member.deptClass || "N/A"} // POS: ${member.position || "N/A"}`;

  useEffect(() => {
    if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);

    if (!isHovered) {
      setClassPosDisplay(IDLE_CLASS_POS);
      return;
    }

    const length = realClassPos.length;
    const totalTicks = 13; // slower than before, per feedback
    let tick = 0;

    scrambleIntervalRef.current = setInterval(() => {
      tick++;
      const revealCount = Math.floor((tick / totalTicks) * length);
      const next = realClassPos
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "/" || ch === ":") return ch;
          if (i < revealCount) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      setClassPosDisplay(next);

      if (tick >= totalTicks) {
        if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
        setClassPosDisplay(realClassPos);
      }
    }, 32);

    return () => {
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
    };
  }, [isHovered, realClassPos]);

  function handleMouseEnter() {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setSliceTopA(15 + Math.random() * 35);
    setSliceTopB(50 + Math.random() * 30);
    setPhase("hovering");
  }

  function handleMouseLeave() {
    setPhase("leaving");
    leaveTimeoutRef.current = setTimeout(() => setPhase("idle"), LEAVE_DURATION_MS);
  }

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const stackClass =
    phase === "hovering" ? "card-hover" : phase === "leaving" ? "card-leaving" : "";

  return (
    <div
      className="w-72 h-[420px] rounded-xl border border-red-950 bg-black shadow-lg shadow-red-950/40 overflow-hidden flex flex-col cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top 70% — photo + cover layers */}
      <div className="relative h-[70%] overflow-hidden">
        {/* Layer 1 (bottom): real photo */}
        <div className="absolute inset-0 bg-zinc-900">
          {member.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Layer 2 (middle): theme cover — glitch reveal on hover, glitch settle on leave */}
        <div className={`card-cover-stack absolute inset-0 ${stackClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base absolute inset-0 w-full h-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base card-cover-ghost card-cover-ghost-a absolute inset-0 w-full h-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base card-cover-ghost card-cover-ghost-b absolute inset-0 w-full h-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base card-cover-ghost card-cover-ghost-c absolute inset-0 w-full h-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base card-cover-slice-a absolute inset-0 w-full h-full object-cover"
            style={{
              clipPath: `inset(${sliceTopA}% 0 ${100 - sliceTopA - 10}% 0)`,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base card-cover-slice-b absolute inset-0 w-full h-full object-cover"
            style={{
              clipPath: `inset(${sliceTopB}% 0 ${100 - sliceTopB - 8}% 0)`,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/red-team-cover.png"
            alt=""
            className="card-cover-base card-cover-noise absolute inset-0 w-full h-full object-cover"
            style={{ filter: "url(#card-noise)" }}
          />
          <div className="card-scan-bar absolute left-0 right-0" />
        </div>
      </div>

      {/* Bottom 30% — info panel */}
      <div className="h-[30%] border-t border-red-950 p-4 flex flex-col justify-center gap-2 relative overflow-hidden">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 transition-colors duration-200"
            style={{ color: isHovered ? "#ef4444" : "#7f1d1d" }}
            aria-label={`${member.name} on LinkedIn`}
          >
            <FaLinkedin size={16} />
          </a>
        )}

        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: isHovered ? "#ef4444" : "#7f1d1d",
              boxShadow: isHovered ? "0 0 6px #ef4444" : "none",
            }}
          />
          <span className="font-mono text-[10px] tracking-wide text-red-500">
            {isHovered ? "[DECRYPTED // SYSTEM BREACH]" : "[NODE // ENCRYPTED]"}
          </span>
        </div>

        <div className="relative h-5">
          <div
            className="absolute inset-0 h-4 w-2/3 rounded-sm origin-left transition-all duration-200"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #1a0505 0 4px, #3a0a0a 4px 8px)",
              transform: isHovered ? "scaleX(0)" : "scaleX(1)",
              opacity: isHovered ? 0 : 1,
              transitionDelay: isHovered ? "50ms" : "0ms",
            }}
          />
          <p
            className="absolute inset-0 font-mono text-sm font-semibold text-red-50 transition-opacity duration-200"
            style={{ opacity: isHovered ? 1 : 0, transitionDelay: isHovered ? "160ms" : "0ms" }}
          >
            {member.name}
          </p>
        </div>

        <p className="font-mono text-[11px] text-red-500/80 tracking-wide">
          {classPosDisplay}
        </p>
      </div>
    </div>
  );
}