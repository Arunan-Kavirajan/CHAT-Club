export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
      <p className="font-mono text-sm text-accent mb-5 tracking-wide">
        SRMIST &middot; CYBERSECURITY
      </p>

      <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight max-w-3xl leading-[1.05]">
        We break things to
        <br />
        understand them.
      </h1>

      <p className="mt-7 text-lg text-foreground/70 max-w-xl leading-relaxed">
        CHAT is SRMIST&apos;s cybersecurity club — students who hack, defend,
        and take systems apart to see how they work. We also build across
        fullstack and AI, but security is what we&apos;re here for.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <a
          href="/join"
          className="font-mono text-sm px-5 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
        >
          Join CHAT →
        </a>
        <a
          href="/events"
          className="font-mono text-sm px-5 py-3 rounded-md border border-foreground/15 hover:border-accent/60 transition-colors"
        >
          See what we do
        </a>
      </div>
    </section>
  );
}