export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
};

// Placeholder projects — swap for real member/club work, or fetch from
// Firestore once the admin panel exists.
export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Project Name",
    description: "One or two lines on what it does and why it exists.",
    tags: ["Tech", "Tags"],
    link: "https://github.com/",
  },
  {
    id: "2",
    title: "Project Name",
    description: "One or two lines on what it does and why it exists.",
    tags: ["Tech", "Tags"],
  },
  {
    id: "3",
    title: "Project Name",
    description: "One or two lines on what it does and why it exists.",
    tags: ["Tech", "Tags"],
  },
];