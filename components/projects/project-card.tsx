import type { Project } from "@/lib/data/projects";

function CardContent({ project }: { project: Project }) {
  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-foreground/70">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs px-2 py-1 rounded bg-muted text-foreground/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const className =
    "group block rounded-lg border border-foreground/15 hover:border-accent/60 p-6 transition-colors";

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <CardContent project={project} />
      </a>
    );
  }

  return (
    <div className={className}>
      <CardContent project={project} />
    </div>
  );
}