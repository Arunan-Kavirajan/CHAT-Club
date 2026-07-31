import { ProjectGrid } from "@/components/projects/project-grid";

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">WHAT WE BUILD</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Projects
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        Real things members have built — tools, apps, and research, not just
        tutorials.
      </p>

      <div className="mt-16">
        <ProjectGrid />
      </div>
    </section>
  );
}