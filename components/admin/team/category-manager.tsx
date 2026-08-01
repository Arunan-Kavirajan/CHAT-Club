"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import type { AdminTeamCategory, AdminTeam } from "@/lib/team-types";

type Props = {
  categories: AdminTeamCategory[];
  onChange: (categories: AdminTeamCategory[]) => void;
  onDeleteCategory: (id: string) => void;
};

export function CategoryManager({ categories, onChange, onDeleteCategory }: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTeamNameByCategory, setNewTeamNameByCategory] = useState<Record<string, string>>({});

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const next: AdminTeamCategory = { id: crypto.randomUUID(), name, teams: [] };
    onChange([...categories, next]);
    setNewCategoryName("");
  }

  function addTeam(categoryId: string) {
    const name = (newTeamNameByCategory[categoryId] || "").trim();
    if (!name) return;
    onChange(
      categories.map((c) =>
        c.id === categoryId
          ? { ...c, teams: [...c.teams, { id: crypto.randomUUID(), name }] }
          : c,
      ),
    );
    setNewTeamNameByCategory((prev) => ({ ...prev, [categoryId]: "" }));
  }

  function deleteTeam(categoryId: string, teamId: string) {
    onChange(
      categories.map((c) =>
        c.id === categoryId
          ? { ...c, teams: c.teams.filter((t) => t.id !== teamId) }
          : c,
      ),
    );
  }

  function reorderTeams(categoryId: string, newTeams: AdminTeam[]) {
    onChange(categories.map((c) => (c.id === categoryId ? { ...c, teams: newTeams } : c)));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="New category name"
          className="admin-input flex-1"
        />
        <button
          onClick={addCategory}
          className="font-mono text-xs px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity"
        >
          Add category
        </button>
      </div>

      <Reorder.Group axis="y" values={categories} onReorder={onChange} className="flex flex-col gap-3">
        {categories.map((category) => (
          <Reorder.Item
            key={category.id}
            value={category}
            className="rounded-lg border border-[var(--admin-accent-soft)] bg-[var(--admin-muted)]/40 p-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{category.name}</span>
              <button
                onClick={() => onDeleteCategory(category.id)}
                className="font-mono text-xs text-[var(--admin-foreground)]/40 hover:text-[var(--admin-accent)] transition-colors"
              >
                Delete
              </button>
            </div>

            <div className="mt-3 pl-4 border-l border-[var(--admin-accent-soft)] flex flex-col gap-2">
              <Reorder.Group
                axis="y"
                values={category.teams}
                onReorder={(newTeams) => reorderTeams(category.id, newTeams)}
                className="flex flex-col gap-2"
              >
                {category.teams.map((team) => (
                  <Reorder.Item
                    key={team.id}
                    value={team}
                    className="flex items-center justify-between text-sm rounded px-2 py-1.5 bg-[var(--admin-bg)]/60 cursor-grab active:cursor-grabbing"
                  >
                    <span>{team.name}</span>
                    <button
                      onClick={() => deleteTeam(category.id, team.id)}
                      className="font-mono text-xs text-[var(--admin-foreground)]/40 hover:text-[var(--admin-accent)] transition-colors"
                    >
                      Remove
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              <div className="flex gap-2 mt-1">
                <input
                  value={newTeamNameByCategory[category.id] || ""}
                  onChange={(e) =>
                    setNewTeamNameByCategory((prev) => ({ ...prev, [category.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addTeam(category.id)}
                  placeholder="New team (optional)"
                  className="admin-input flex-1 text-xs py-1.5"
                />
                <button
                  onClick={() => addTeam(category.id)}
                  className="font-mono text-xs px-3 py-1.5 rounded bg-[var(--admin-accent)]/20 text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/30 transition-colors"
                >
                  Add team
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {categories.length === 0 && (
        <p className="font-mono text-xs text-[var(--admin-foreground)]/40">
          No categories yet — add one above.
        </p>
      )}
    </div>
  );
}