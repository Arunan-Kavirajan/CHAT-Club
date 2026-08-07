"use client";

import type { AdminMember, AdminTeamCategory } from "@/lib/team-types";
import { MemberCardBlue } from "./member-card-blue";
import { MemberCardRed } from "./member-card-red";
import { GlitchNoiseDef } from "./glitch-noise-def";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { useTheme } from "@/components/theme/theme-context";
import { HoverScramble } from "@/components/motion/hover-scramble";

export function TeamSection({
  category,
  members,
  index,
}: {
  category: AdminTeamCategory;
  members: AdminMember[];
  index: number;
}) {
  const { theme } = useTheme();
  const isRed = theme === "dark";
  const noTeamMembers = members.filter((m) => !m.teamId);
  const teamGroups = category.teams.map((team) => ({
    team,
    members: members.filter((m) => m.teamId === team.id),
  }));

  return (
    <ScrollReveal className="mb-20">
      {isRed && <GlitchNoiseDef />}

      <p className="font-mono text-xs tracking-[0.35em] text-accent mb-2">
        CATEGORY // {String(index + 1).padStart(2, "0")}
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 pb-3 border-b border-foreground/10">
        <HoverScramble>{category.name}</HoverScramble>
      </h2>

      {noTeamMembers.length > 0 && (
        <ScrollRevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {noTeamMembers.map((member) => (
            <ScrollRevealItem key={member.id}>
              {isRed ? <MemberCardRed member={member} /> : <MemberCardBlue member={member} />}
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      )}

      {teamGroups.map(
        ({ team, members: teamMembers }) =>
          teamMembers.length > 0 && (
            <div key={team.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-accent text-lg leading-none">//</span>
                <h3 className="font-mono text-base sm:text-lg font-semibold tracking-wide uppercase text-foreground">
                  <HoverScramble>{team.name}</HoverScramble>
                </h3>
                <span className="flex-1 h-px bg-foreground/10" />
              </div>

              <ScrollRevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <ScrollRevealItem key={member.id}>
                    {isRed ? <MemberCardRed member={member} /> : <MemberCardBlue member={member} />}
                  </ScrollRevealItem>
                ))}
              </ScrollRevealGroup>
            </div>
          ),
      )}
    </ScrollReveal>
  );
}