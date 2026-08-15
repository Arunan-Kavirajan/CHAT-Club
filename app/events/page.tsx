import type { Metadata } from "next";
import { EventsPageContent } from "@/components/events/events-page-content";

export const metadata: Metadata = {
  title: "Events",
  description: "CTFs, talks, and workshops from CHAT, SRMIST's cybersecurity club.",
};

export default function EventsPage() {
  return <EventsPageContent />;
}