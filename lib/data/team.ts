export type TeamMember = {
  id: string;
  name: string;
  role: string;
  track: "Security" | "Dev" | "AI";
  photoUrl?: string; // omit to fall back to initials
};

// Placeholder roster — swap these for real members, or fetch from
// Firestore once the admin panel is built.
export const TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Member Name", role: "President", track: "Security" },
  { id: "2", name: "Member Name", role: "Technical Head", track: "Security" },
  {
    id: "3",
    name: "Arunan Kavirajan",
    role: "Technical Team Vice Head",
    track: "Dev",
  },
  { id: "4", name: "Member Name", role: "Events Lead", track: "Security" },
  { id: "5", name: "Member Name", role: "Member", track: "AI" },
  { id: "6", name: "Member Name", role: "Member", track: "Dev" },
];