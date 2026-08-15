import Link from "next/link";
import { HoverScramble } from "@/components/motion/hover-scramble";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-accent mb-4">[ ERROR 404 ]</p>
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
        <HoverScramble>Signal Lost</HoverScramble>
      </h1>
      <p className="mt-5 text-foreground/60 max-w-md">
        This node does not exist on our network. It may have been moved,
        deleted, or never existed at all.
      </p>
      <Link
        href="/"
        className="mt-8 font-mono text-sm px-5 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity"
      >
        <HoverScramble>Return to Base →</HoverScramble>
      </Link>
    </section>
  );
}