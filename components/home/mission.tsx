import { HoverScramble } from "@/components/motion/hover-scramble";

export function Mission() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">
        <HoverScramble>What CHAT Is</HoverScramble>
      </h2>
      <p className="mt-5 text-foreground/70 leading-relaxed">
        A club built around one idea. Understanding a system well enough to
        secure it, or well enough to break it. Everything else we do grows
        out of that.
      </p>
    </section>
  );
}