import type { TeamMember } from "@/lib/data/team";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group">
      <div className="aspect-square rounded-lg bg-muted overflow-hidden relative">
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-2xl text-foreground/30 group-hover:text-accent transition-colors duration-500">
            {initials(member.name)}
          </div>
        )}
      </div>

      <p className="mt-3 font-medium">{member.name}</p>
      <p className="text-sm text-foreground/60">{member.role}</p>
      <p className="mt-1 font-mono text-xs tracking-wide text-foreground/40">
        {member.track}
      </p>
    </div>
  );
}