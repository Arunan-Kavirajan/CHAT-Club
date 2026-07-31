export type ClubEvent = {
  id: string;
  title: string;
  date: string; // display string for now, e.g. "Mar 14, 2026"
  description: string;
  status: "upcoming" | "past";
  link?: string;
};

// Placeholder events — swap for real ones, or fetch from Firestore once
// the admin panel exists. Keep newest-first within each status.
export const EVENTS: ClubEvent[] = [
  {
    id: "1",
    title: "Beyond the Breach",
    date: "TBA",
    description:
      "A look at real-world exploits — how they happened and how they were caught.",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Intro CTF Night",
    date: "TBA",
    description:
      "A beginner-friendly capture-the-flag for anyone curious about security.",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Beyond the Breach — Online Talk",
    date: "Past event",
    description:
      "Cybersecurity talk covering breach anatomy, presented to the CHAT community.",
    status: "past",
  },
];