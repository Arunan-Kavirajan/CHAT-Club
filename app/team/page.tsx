"use client";

import { useEffect, useState } from "react";
import { TeamSection } from "@/components/team/team-section";
import type { AdminMember, AdminTeamCategory } from "@/lib/team-types";
import { subscribeCategories, subscribeMembers } from "@/lib/firebase-team";

export default function TeamPage() {
  const [categories, setCategories] = useState<AdminTeamCategory[]>([]);
  const [members, setMembers] = useState<AdminMember[]>([]);

  useEffect(() => {
    const unsubCategories = subscribeCategories(setCategories);
    const unsubMembers = subscribeMembers(setMembers);
    return () => {
      unsubCategories();
      unsubMembers();
    };
  }, []);

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
        {categories.length === 0 && (
          <p className="font-mono text-sm text-foreground/40">
            Team info coming soon.
          </p>
        )}
        {categories.map((category) => (
          <TeamSection
            key={category.id}
            category={category}
            members={members.filter((m) => m.categoryId === category.id)}
          />
        ))}
      </div>
    </section>
  );
}