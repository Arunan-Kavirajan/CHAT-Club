import type { Metadata } from "next";
import { TeamPageContent } from "@/components/team/team-page-content";

export const metadata: Metadata = {
  title: "Team — CHAT",
  description: "Meet the operators behind CHAT, SRMIST's cybersecurity club.",
};

export default function TeamPage() {
  return <TeamPageContent />;
}