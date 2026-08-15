import type { Metadata } from "next";
import { GalleryPageContent } from "@/components/gallery/gallery-page-content";

export const metadata: Metadata = {
  title: "Gallery — CHAT",
  description: "Visual records of past CHAT operations, CTFs, and events.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}