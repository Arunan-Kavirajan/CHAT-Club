import { TeamGrid } from "@/components/team/team-grid";

export default function TeamPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">THE PEOPLE</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Team
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        The people running CHAT — mostly security, with room for the members
        building across other tech too.
      </p>

      <div className="mt-16">
        <TeamGrid />
      </div>
    </section>
  );
}