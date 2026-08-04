import { Hero } from "@/components/home/hero";
import { Mission } from "@/components/home/mission";
import { GalleryPreview } from "@/components/home/gallery-preview";
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
        <GalleryPreview />
      </ScrollReveal>
      <ScrollReveal>
        <Cta />
      </ScrollReveal>
    </>
  );
}