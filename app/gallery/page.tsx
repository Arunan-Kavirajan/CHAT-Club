import { GalleryGrid } from "@/components/gallery/gallery-grid";

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">MOMENTS</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Gallery
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        CTFs, workshops, and everything in between.
      </p>

      <div className="mt-16">
        <GalleryGrid />
      </div>
    </section>
  );
}