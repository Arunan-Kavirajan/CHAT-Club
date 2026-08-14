import { HoverScramble } from "@/components/motion/hover-scramble";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 border-t border-foreground/10">
      <div
        className="rounded-2xl border p-10 sm:p-14 flex flex-col items-start gap-6"
        style={{
          borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
          boxShadow: "0 0 40px color-mix(in srgb, var(--accent) 12%, transparent)",
        }}
      >
        <p className="font-mono text-xs tracking-[0.3em] text-accent">[ JOIN THE NETWORK ]</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-lg">
          <HoverScramble>Ready To Access The Terminal?</HoverScramble>
        </h2>
        <p className="text-foreground/70 max-w-lg">
          Whether you are interested in ethical hacking, software
          development, AI, or hardware engineering, CHAT gives you the
          infrastructure and community to grow.
        </p>
        <a
          href="/join"
          className="font-mono text-sm px-6 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
        >
          <HoverScramble>Become An Operator →</HoverScramble>
        </a>
      </div>
    </section>
  );
}