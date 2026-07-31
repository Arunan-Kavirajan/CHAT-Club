// Placeholder until Firestore is wired up — replace with the actual next
// event once the Events data layer exists.
const NEXT_EVENT = {
  label: "NEXT EVENT",
  title: "Beyond the Breach",
  detail: "A look at real-world exploits and how they were caught.",
};

export function Highlight() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-foreground/10">
      <a
        href="/events"
        className="group block rounded-lg border border-foreground/15 hover:border-accent/60 p-8 sm:p-10 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-accent mb-3">
              {NEXT_EVENT.label}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">
              {NEXT_EVENT.title}
            </h3>
            <p className="mt-2 text-foreground/70">{NEXT_EVENT.detail}</p>
          </div>

          <span className="font-mono text-sm text-foreground/50 group-hover:text-accent transition-colors whitespace-nowrap">
            View all events →
          </span>
        </div>
      </a>
    </section>
  );
}