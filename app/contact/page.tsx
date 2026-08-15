import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/contact-page-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to CHAT with questions, feedback, or concerns.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}