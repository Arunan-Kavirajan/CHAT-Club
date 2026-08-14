import { HoverScramble } from "@/components/motion/hover-scramble";

export function StatementBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-4">
      <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-accent">
        <HoverScramble>BREACH. DEFEND. INNOVATE.</HoverScramble>
      </h2>
    </section>
  );
}