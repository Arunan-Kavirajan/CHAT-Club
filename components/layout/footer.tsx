import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HoverScramble } from "@/components/motion/hover-scramble";

const FOOTER_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, var(--accent), transparent)",
          opacity: 0.5,
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <p className="font-mono font-bold text-sm tracking-wide">CHAT</p>
          <p className="mt-2 text-xs text-foreground/50 leading-relaxed max-w-[220px]">
            Community of Hackers and Advanced Technologists, SRMIST.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/30 mb-1">
            NAVIGATE
          </p>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-foreground/50 hover:text-accent transition-colors w-fit"
            >
              <HoverScramble>{link.label}</HoverScramble>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/30">BUILT BY</p>
          <p className="font-mono text-xs text-foreground/70">Arunan Kavirajan</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/arunan-kavirajan"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/40 hover:text-accent transition-colors"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://linkedin.com/in/arunan-kavirajan"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/40 hover:text-accent transition-colors"
            >
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <p className="font-mono text-[10px] text-foreground/30">© 2026 CHAT SRMIST</p>
          <p className="font-mono text-[10px] text-foreground/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> SYSTEM ONLINE
          </p>
        </div>
      </div>
    </footer>
  );
}