import type { Metadata } from "next";
import { JoinPageContent } from "@/components/join/join-page-content";

export const metadata: Metadata = {
  title: "Join",
  description: "Apply to join CHAT, SRMIST's cybersecurity club.",
};

export default function JoinPage() {
  return <JoinPageContent />;
}