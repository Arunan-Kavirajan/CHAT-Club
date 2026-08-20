"use client";

import { useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import type { AdminMember } from "@/lib/team-types";
import { toDisplayUrl } from "@/lib/image-cdn";

type Phase = "idle" | "hovering" | "leaving";
const LEAVE_DURATION_MS = 400;

export function MemberCardBlue({ member }: { member: AdminMember }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHovered = phase === "hovering";

  function handleMouseEnter() {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setPhase("hovering");
  }

  function handleMouseLeave() {
    setPhase("leaving");
    leaveTimeoutRef.current = setTimeout(() => setPhase("idle"), LEAVE_DURATION_MS);
  }

  const stackClass =
    phase === "hovering" ? "card-hover" : phase === "leaving" ? "card-leaving" : "";

  return (
    <div
      className="w-72 h-[420px] rounded-xl border border-cyan-900/50 bg-slate-950 shadow-lg shadow-cyan-950/30 overflow-hidden flex flex-col cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top 70% — photo + cover layers */}
      <div className="relative h-[70%] overflow-hidden">
        {/* Base: real photo, always present */}
        <div className="absolute inset-0 bg-slate-900">
          {member.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={toDisplayUrl(member.photoUrl)} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Cover, always visible at rest */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/team/blue-team-cover.png"
          alt=""
          className="card-cover-base absolute inset-0 w-full h-full object-cover"
        />

        {/* Reveal copy of the photo, punches through via growing circle */}
        {member.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt=""
            className={`card-iris-reveal absolute inset-0 w-full h-full object-cover ${stackClass}`}
          />
        )}

        {/* Idle laser sweep — hidden once hover sequence starts */}
        <div className={`blue-laser-sweep absolute left-0 right-0 ${stackClass}`} />

        {/* Full-frame lock flash — "target acquired" */}
        <div className={`blue-lock-flash-full absolute inset-0 ${stackClass}`} />

        {/* Holographic grid-flicker over the revealed area */}
        <div
          className={`blue-grid-flicker absolute inset-0 ${stackClass}`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(103,232,249,0.5) 0px, rgba(103,232,249,0.5) 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, rgba(103,232,249,0.5) 0px, rgba(103,232,249,0.5) 1px, transparent 1px, transparent 9px)",
          }}
        />

        {/* Secondary fast scan sweep during reveal (distinct from idle sweep) */}
        <div className={`blue-reveal-scan absolute left-0 right-0 ${stackClass}`} />

        {/* HUD corner brackets — slide in from outside the card, then lock */}
        <span className={`blue-hud-bracket blue-hud-tl ${stackClass}`} />
        <span className={`blue-hud-bracket blue-hud-tr ${stackClass}`} />
        <span className={`blue-hud-bracket blue-hud-bl ${stackClass}`} />
        <span className={`blue-hud-bracket blue-hud-br ${stackClass}`} />
      </div>

      {/* Bottom 30% — info panel */}
      <div className="h-[30%] border-t border-cyan-900/50 p-4 flex flex-col justify-center gap-2 relative overflow-hidden">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 transition-colors duration-200"
            style={{ color: isHovered ? "#22d3ee" : "#64748b" }}
            aria-label={`${member.name} on LinkedIn`}
          >
            <FaLinkedin size={16} />
          </a>
        )}

        <div className={`blue-scanbar absolute inset-x-0 top-0 h-full ${stackClass}`} />

        <div className="flex items-center gap-2 relative">
          <span
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "#22d3ee" : "#64748b",
              boxShadow: isHovered ? "0 0 6px #22d3ee" : "none",
            }}
          />
          <span
            className="font-mono text-[10px] tracking-wide transition-colors duration-300"
            style={{ color: isHovered ? "#22d3ee" : "#94a3b8" }}
          >
            {isHovered ? "[VERIFIED // ACCESS GRANTED]" : "[STATUS: RESTRICTED]"}
          </span>
        </div>

        <p
          className="font-mono text-sm font-semibold select-none transition-all duration-300 relative"
          style={{
            filter: isHovered ? "blur(0px)" : "blur(4px)",
            color: isHovered ? "#ecfeff" : "#cbd5e1",
            transitionDelay: isHovered ? "80ms" : "0ms",
          }}
        >
          {member.name}
        </p>

        <p
          className="font-mono text-[11px] tracking-wide transition-all duration-300 relative"
          style={{
            color: isHovered ? "#67e8f9" : "#64748b",
            transitionDelay: isHovered ? "140ms" : "0ms",
          }}
        >
          {isHovered
            ? `CLASS: ${member.deptClass || "N/A"} | POS: ${member.position || "N/A"}`
            : "CLEARANCE: LEVEL 1"}
        </p>
      </div>
    </div>
  );
}