import { HoverScramble } from "@/components/motion/hover-scramble";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 border-t border-foreground/10">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-lg">
          <HoverScramble>
            If you want to understand how things break, you&apos;re in the right place.
          </HoverScramble>
        </h2>
        <a
          href="/join"
          className="font-mono text-sm px-5 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
        >
          <HoverScramble>Join CHAT →</HoverScramble>
        </a>
      </div>
    </section>
  );
}