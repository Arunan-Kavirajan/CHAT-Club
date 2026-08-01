"use client";

import { useEffect, useState } from "react";
import { CategoryManager } from "@/components/admin/team/category-manager";
import { MemberDialog } from "@/components/admin/team/member-dialog";
import type { AdminMember, AdminTeamCategory } from "@/lib/team-types";
import {
  subscribeCategories,
  subscribeMembers,
  syncCategories,
  deleteCategory as deleteCategoryDoc,
  createMemberWithId,
  updateMemberDoc,
  deleteMemberDoc,
} from "@/lib/firebase-team";
import { deleteImageFromGithub } from "@/lib/github-upload";

export default function AdminTeamPage() {
  const [categories, setCategories] = useState<AdminTeamCategory[]>([]);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminMember | null>(null);

  useEffect(() => {
    const unsubCategories = subscribeCategories(setCategories);
    const unsubMembers = subscribeMembers(setMembers);
    return () => {
      unsubCategories();
      unsubMembers();
    };
  }, []);

  function handleCategoriesChange(next: AdminTeamCategory[]) {
    setCategories(next); // optimistic — onSnapshot confirms shortly after
    syncCategories(next);
  }

  function handleDeleteCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryDoc(id);
  }

  function handleSaveMember(data: AdminMember) {
    const { id, ...rest } = data;
    if (editingMember) {
      updateMemberDoc(id, rest);
    } else {
      createMemberWithId(id, rest, members.length);
    }
  }

  function handleDeleteMember(id: string) {
    const member = members.find((m) => m.id === id);
    deleteMemberDoc(id);
    if (member?.photoUrl) {
      deleteImageFromGithub(member.photoUrl); // best-effort, not blocking
    }
  }

  function categoryName(id: string) {
    return categories.find((c) => c.id === id)?.name || "—";
  }

  function teamName(categoryId: string, teamId: string | null) {
    if (!teamId) return null;
    return categories.find((c) => c.id === categoryId)?.teams.find((t) => t.id === teamId)?.name || null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs tracking-wide text-[var(--admin-accent)] mb-3">CHAT ADMIN</p>
      <h1 className="text-3xl font-semibold tracking-tight">Team</h1>
      <p className="mt-2 text-[var(--admin-foreground)]/60">
        Categories and teams control the structure of the public Team page. Drag to
        reorder — order here matches display order there. Changes are live.
      </p>

      <div className="mt-10">
        <h2 className="font-mono text-sm tracking-wide text-[var(--admin-foreground)]/50 mb-4">
          CATEGORIES
        </h2>
        <CategoryManager
          categories={categories}
          onChange={handleCategoriesChange}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>

      <div className="mt-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-sm tracking-wide text-[var(--admin-foreground)]/50">
            MEMBERS
          </h2>
          <button
            onClick={() => {
              setEditingMember(null);
              setDialogOpen(true);
            }}
            disabled={categories.length === 0}
            className="font-mono text-xs px-4 py-2 rounded-md bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Add member
          </button>
        </div>

        {categories.length === 0 && (
          <p className="font-mono text-xs text-[var(--admin-foreground)]/40">
            Add a category first before adding members.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {members.map((member) => {
            const team = teamName(member.categoryId, member.teamId);
            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-[var(--admin-accent-soft)] bg-[var(--admin-muted)]/30 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="font-mono text-xs text-[var(--admin-foreground)]/50">
                    {categoryName(member.categoryId)}
                    {team ? ` / ${team}` : ""}
                    {member.deptClass ? ` · ${member.deptClass}` : ""}
                    {member.position ? ` · ${member.position}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setDialogOpen(true);
                    }}
                    className="font-mono text-xs text-[var(--admin-foreground)]/50 hover:text-[var(--admin-accent)] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="font-mono text-xs text-[var(--admin-foreground)]/50 hover:text-[var(--admin-accent)] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MemberDialog
        open={dialogOpen}
        categories={categories}
        initialData={editingMember}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveMember}
      />
    </section>
  );
}