import { HoverScramble } from "@/components/motion/hover-scramble";

const FOCUS_AREAS = [
  {
    label: "Cybersecurity",
    detail: "CTFs, red/blue team exercises, and real vulnerability research.",
    primary: true,
  },
  {
    label: "Fullstack",
    detail: "Shipping real tools and products, not just tutorials.",
    primary: false,
  },
  {
    label: "AI & ML",
    detail: "Applied projects, not just theory.",
    primary: false,
  },
];

export function Mission() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-foreground/10">
      <div className="grid sm:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            <HoverScramble>What CHAT is</HoverScramble>
          </h2>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-sm">
            A club built around one idea: understanding a system well enough
            to secure it — or well enough to break it. Everything else we do
            grows out of that.
          </p>
        </div>

        <ul className="flex flex-col gap-6">
          {FOCUS_AREAS.map((area) => (
            <li
              key={area.label}
              className={`pl-5 border-l-2 ${
                area.primary ? "border-accent" : "border-foreground/15"
              }`}
            >
              <p
                className={`font-mono text-sm tracking-wide ${
                  area.primary ? "text-accent" : "text-foreground/60"
                }`}
              >
                <HoverScramble>{area.label}</HoverScramble>
              </p>
              <p className="mt-1 text-foreground/70">{area.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}