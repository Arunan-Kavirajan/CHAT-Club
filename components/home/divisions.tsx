"use client";

import { FaCrosshairs, FaShieldAlt, FaMicrochip } from "react-icons/fa";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { CardScanEffect } from "@/components/ui/card-scan-effect";
import { CyberCardCorners } from "@/components/ui/cyber-card-corners";

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
            <div className="group relative h-full rounded-xl border border-foreground/10 bg-muted/20 p-6 overflow-hidden">
              <div className="relative z-10">
                <div.Icon className="text-accent" size={26} />
                <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-foreground/40">
                  [ {div.tag} ]
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight">
                  <HoverScramble>{div.title}</HoverScramble>
                </h3>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  {div.description}
                </p>
                <ul className="mt-5 flex flex-col gap-1.5">
                  {div.focus.map((f) => (
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
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>
    </section>
  );
}