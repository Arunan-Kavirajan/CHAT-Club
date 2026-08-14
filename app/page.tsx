import { Hero } from "@/components/home/hero";
import { StatusTicker } from "@/components/home/status-ticker";
import { StatementBanner } from "@/components/home/statement-banner";
import { Mission } from "@/components/home/mission";
import { Divisions } from "@/components/home/divisions";
import { Ecosystem } from "@/components/home/ecosystem";
import { PhotoMarquee } from "@/components/home/photo-marquee";
import { Cta } from "@/components/home/cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatusTicker />
      <ScrollReveal>
        <StatementBanner />
      </ScrollReveal>
      <ScrollReveal>
        <Mission />
      </ScrollReveal>
      <Divisions />
      <ScrollReveal>
        <Ecosystem />
      </ScrollReveal>
      <PhotoMarquee />
      <ScrollReveal>
        <Cta />
      </ScrollReveal>
    </>
  );
}