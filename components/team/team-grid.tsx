import { TEAM_MEMBERS } from "@/lib/data/team";
import { MemberCard } from "./member-card";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function TeamGrid() {
  return (
    <ScrollRevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10">
      {TEAM_MEMBERS.map((member) => (
        <ScrollRevealItem key={member.id}>
          <MemberCard member={member} />
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}