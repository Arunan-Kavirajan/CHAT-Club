import { ASPECT_CLASS, type GalleryImage } from "@/lib/data/gallery";

export function GalleryItem({ image }: { image: GalleryImage }) {
  return (
    <div
      className={`${ASPECT_CLASS[image.aspect]} rounded-lg bg-muted overflow-hidden relative`}
    >
      {image.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-mono text-xs text-foreground/30">
            {image.caption}
          </span>
        </div>
      )}
    </div>
  );
}