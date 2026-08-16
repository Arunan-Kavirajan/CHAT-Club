"use client";

import { useEffect, useRef, useState } from "react";
import { FaCrosshairs, FaShieldAlt, FaMicrochip } from "react-icons/fa";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { CardScanEffect } from "@/components/ui/card-scan-effect";
import { CyberCardCorners } from "@/components/ui/cyber-card-corners";
import { useIsTouchDevice } from "@/lib/hooks/use-touch-hover";

const DIVISIONS = [
  {
    tag: "OFFENSIVE OPERATIONS",
    title: "Red Team",
    description:
      "Master ethical hacking, vulnerability research, and penetration testing. Understand how systems break to engineer better defenses.",
    focus: ["CTF Competitions", "Exploit Development", "Web & Network Hacking"],
    Icon: FaCrosshairs,
  },
  {
    tag: "DEFENSIVE ARCHITECTURE",
    title: "Blue Team",
    description:
      "Engineer resilient infrastructure, hunt active threats, and analyze system compromises in real world scenarios.",
    focus: ["Digital Forensics", "SOC Simulations", "System Hardening"],
    Icon: FaShieldAlt,
  },
  {
    tag: "INNOVATION & SYSTEMS",
    title: "Advanced Tech",
    description:
      "Beyond security. Build high performance software, explore AI and ML security, hardware hacking, and open source systems.",
    focus: ["Full-Stack & Systems Dev", "AI/ML & Data Security", "Hardware & IoT"],
    Icon: FaMicrochip,
  },
];

function DivisionCard({ division }: { division: (typeof DIVISIONS)[number] }) {
  const [touched, setTouched] = useState(false);
  const isTouch = useIsTouchDevice();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTouch || !touched) return;
    function handleOutside(e: PointerEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setTouched(false);
      }
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isTouch, touched]);

  return (
    <div
      ref={cardRef}
      onClick={() => isTouch && setTouched((t) => !t)}
      className={`group relative h-full rounded-xl border border-foreground/10 bg-muted/20 p-6 overflow-hidden ${touched ? "is-touch-active" : ""}`}
    >
      <div className="relative z-10">
        <division.Icon className="text-accent" size={26} />
        <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-foreground/40">
          [ {division.tag} ]
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight">
          <HoverScramble>{division.title}</HoverScramble>
        </h3>
        <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
          {division.description}
        </p>
        <ul className="mt-5 flex flex-col gap-1.5">
          {division.focus.map((f) => (
            <li
              key={f}
              className="font-mono text-xs text-foreground/50 flex items-center gap-2"
            >
              <span className="text-accent">›</span> {f}
            </li>
          ))}
        </ul>
      </div>
      <CardScanEffect />
      <CyberCardCorners />
    </div>
  );
}

export function Divisions() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 border-t border-foreground/10">
      <p className="font-mono text-sm text-accent mb-3">01 // SPECIALIZATIONS</p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl">
        <HoverScramble>Operational Divisions</HoverScramble>
      </h2>
      <p className="mt-4 text-foreground/60 max-w-xl">
        Grounded in cybersecurity, expanding across the full technology
        stack.
      </p>

      <ScrollRevealGroup className="mt-12 grid sm:grid-cols-3 gap-5" stagger={0.12}>
        {DIVISIONS.map((div) => (
          <ScrollRevealItem key={div.title}>
            <DivisionCard division={div} />
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>
    </section>
  );
}