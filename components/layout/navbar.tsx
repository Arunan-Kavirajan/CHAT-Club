import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-foreground/10">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono font-semibold tracking-wide">
          CHAT
        </Link>

        <div className="hidden sm:flex items-center gap-8 font-mono text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/join"
            className="font-mono text-xs tracking-wide px-3 py-1.5 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
          >
            Join
          </Link>
        </div>
      </nav>
    </header>
  );
}
