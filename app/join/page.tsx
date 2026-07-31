export default function JoinPage() {
  // Recruitment happens through an external Google Form, not a native form.
  const GOOGLE_FORM_URL = "https://forms.gle/REPLACE_ME";

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 flex flex-col items-start gap-6">
      <h1 className="text-4xl font-semibold tracking-tight">Join CHAT</h1>
      <p className="text-foreground/70 max-w-xl">
        Ready to join a community of hackers and advanced technologists?
        Fill out the form and we&apos;ll be in touch.
      </p>
      <a
        href={GOOGLE_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm px-5 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
      >
        Open application form →
      </a>
    </section>
  );
}
