import { PROJECTS } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

export function ProjectGrid() {
  return (
    <ScrollRevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROJECTS.map((project) => (
        <ScrollRevealItem key={project.id}>
          <ProjectCard project={project} />
        </ScrollRevealItem>
      ))}
    </ScrollRevealGroup>
  );
}