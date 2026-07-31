export type GalleryImage = {
  id: string;
  caption: string;
  aspect: "square" | "portrait" | "landscape";
  src?: string; // omit to render a placeholder block
};

// Placeholder gallery — swap in real event/club photos, or fetch from
// Firestore once the admin panel exists.
export const GALLERY_IMAGES: GalleryImage[] = [
  { id: "1", caption: "CTF Night", aspect: "landscape" },
  { id: "2", caption: "Workshop", aspect: "portrait" },
  { id: "3", caption: "Beyond the Breach", aspect: "square" },
  { id: "4", caption: "Team meetup", aspect: "portrait" },
  { id: "5", caption: "Hack session", aspect: "landscape" },
  { id: "6", caption: "Club event", aspect: "square" },
];

export const ASPECT_CLASS: Record<GalleryImage["aspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};