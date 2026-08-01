import type { AdminMember, AdminTeamCategory } from "@/lib/team-types";
import { MemberCard } from "./member-card";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function TeamSection({
  category,
  members,
}: {
  category: AdminTeamCategory;
  members: AdminMember[];
}) {
  const noTeamMembers = members.filter((m) => !m.teamId);
  const teamGroups = category.teams.map((team) => ({
    team,
    members: members.filter((m) => m.teamId === team.id),
  }));

  return (
    <ScrollReveal className="mb-16">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">{category.name}</h2>

      {noTeamMembers.length > 0 && (
        <ScrollRevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {noTeamMembers.map((member) => (
            <ScrollRevealItem key={member.id}>
              <MemberCard member={member} />
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      )}

      {teamGroups.map(
        ({ team, members: teamMembers }) =>
          teamMembers.length > 0 && (
            <div key={team.id} className="mb-10">
              <h3 className="font-mono text-sm tracking-wide text-foreground/50 mb-4">
                {team.name}
              </h3>
              <ScrollRevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <ScrollRevealItem key={member.id}>
                    <MemberCard member={member} />
                  </ScrollRevealItem>
                ))}
              </ScrollRevealGroup>
            </div>
          ),
      )}
    </ScrollReveal>
  );
}