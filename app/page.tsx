import { Hero } from "@/components/home/hero";
import { Mission } from "@/components/home/mission";
import { Highlight } from "@/components/home/highlight";
import { Cta } from "@/components/home/cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <Mission />
      </ScrollReveal>
      <ScrollReveal>
        <Highlight />
      </ScrollReveal>
      <ScrollReveal>
        <Cta />
      </ScrollReveal>
    </>
  );
}