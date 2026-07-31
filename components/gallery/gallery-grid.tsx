import { GALLERY_IMAGES } from "@/lib/data/gallery";
import { GalleryItem } from "./gallery-item";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function GalleryGrid() {
  return (
    <ScrollRevealGroup className="columns-2 sm:columns-3 gap-6" stagger={0.05}>
      {GALLERY_IMAGES.map((image) => (
        <ScrollRevealItem key={image.id} className="break-inside-avoid mb-6 group">
          <GalleryItem image={image} />
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}