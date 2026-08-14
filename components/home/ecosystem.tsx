import { HoverScramble } from "@/components/motion/hover-scramble";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

const PILLARS = [
  {
    title: "Cyber-First, Tech-Wide",
    description:
      "Security is our core identity, but we build and explore across the entire stack. Software, infrastructure, and hardware.",
  },
  {
    title: "Hands-On Execution",
    description:
      "Live attack and defend labs, sandbox environments, hackathons, and open source projects you can actually ship.",
  },
  {
    title: "Peer-Led Mentorship",
    description:
      "Learn directly from experienced developers and security researchers through workshops and collaborative research.",
  },
];

export function Ecosystem() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-foreground/10">
      <p className="font-mono text-sm text-accent mb-3">02 // INTEL &amp; PROTOCOLS</p>
      <h2 className="text-3xl font-bold tracking-tight">
        <HoverScramble>The CHAT Ecosystem</HoverScramble>
      </h2>

      <ScrollRevealGroup className="mt-10 grid sm:grid-cols-3 gap-6" stagger={0.1}>
        {PILLARS.map((pillar) => (
          <ScrollRevealItem key={pillar.title}>
            <div className="h-full pl-4 border-l-2 border-accent/40">
              <h3 className="font-semibold text-base">{pillar.title}</h3>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>
    </section>
  );
}