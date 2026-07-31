import { EVENTS } from "@/lib/data/events";
import { Timeline } from "@/components/events/timeline";

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  const past = EVENTS.filter((e) => e.status === "past");

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">WHAT WE DO</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        Events
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        CTFs, talks, and workshops — upcoming and past.
      </p>

      <div className="mt-16 grid sm:grid-cols-2 gap-16">
        <div>
          <h2 className="font-mono text-sm tracking-wide text-foreground/50 mb-8">
            UPCOMING
          </h2>
          <Timeline events={upcoming} />
        </div>

        <div>
          <h2 className="font-mono text-sm tracking-wide text-foreground/50 mb-8">
            PAST
          </h2>
          <Timeline events={past} />
        </div>
      </div>
    </section>
  );
}