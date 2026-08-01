import { FaLinkedin } from "react-icons/fa";
import type { AdminMember } from "@/lib/team-types";

export function MemberCard({ member }: { member: AdminMember }) {
  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{member.name}</p>
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
  );
}