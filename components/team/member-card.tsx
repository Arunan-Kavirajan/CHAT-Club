import { FaLinkedin } from "react-icons/fa";
import type { AdminMember } from "@/lib/team-types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MemberCard({ member }: { member: AdminMember }) {
  return (
    <div className="rounded-lg border border-foreground/10 p-4 flex items-start gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-mono text-xs text-foreground/40">
            {initials(member.name)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium truncate">{member.name}</p>
            {member.position && (
              <p className="text-sm text-foreground/60">{member.position}</p>
            )}
          </div>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/40 hover:text-accent transition-colors shrink-0"
              aria-label={`${member.name} on LinkedIn`}
            >
              <FaLinkedin size={18} />
            </a>
          )}
        </div>
        {member.deptClass && (
          <p className="mt-2 font-mono text-xs text-foreground/40">
            {member.deptClass}
          </p>
        )}
      </div>
    </div>
  );
}