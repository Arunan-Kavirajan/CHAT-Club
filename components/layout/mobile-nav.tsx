"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HoverScramble } from "@/components/motion/hover-scramble";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden flex flex-col gap-1.5 p-2"
        aria-label="Open menu"
      >
        <span className="w-6 h-0.5 bg-foreground" />
        <span className="w-6 h-0.5 bg-foreground" />
        <span className="w-6 h-0.5 bg-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[150] bg-black/60 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[160] w-72 max-w-[80vw] bg-background border-l border-foreground/10 sm:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-foreground/10">
                <span className="font-mono font-semibold tracking-wide">CHAT</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-foreground/60 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-lg py-3 text-foreground/80 hover:text-accent transition-colors border-b border-foreground/5"
                  >
                    <HoverScramble>{link.label}</HoverScramble>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-6">
                <Link
                  href="/join"
                  onClick={() => setOpen(false)}
                  className="block text-center font-mono text-sm px-4 py-3 rounded-md bg-accent text-background"
                >
                  <HoverScramble>Join</HoverScramble>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}