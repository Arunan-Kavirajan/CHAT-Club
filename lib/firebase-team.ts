import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  setDoc,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AdminMember, AdminTeamCategory } from "@/lib/team-types";

const CATEGORIES_COLLECTION = "teamCategories";
const MEMBERS_COLLECTION = "teamMembers";

export function subscribeCategories(
  callback: (categories: AdminTeamCategory[]) => void,
) {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name as string,
          teams: (data.teams || []) as AdminTeamCategory["teams"],
        };
      }),
    );
  });
}

export function subscribeMembers(callback: (members: AdminMember[]) => void) {
  const q = query(collection(db, MEMBERS_COLLECTION), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name as string,
          categoryId: data.categoryId as string,
          teamId: (data.teamId ?? null) as string | null,
          deptClass: data.deptClass as string,
          position: data.position as string,
          linkedin: data.linkedin as string,
          photoUrl: (data.photoUrl ?? null) as string | null,
        };
      }),
    );
  });
}

// Add / edit / reorder categories and teams all funnel through this —
// it upserts every category currently in the list with its current
// teams array and index-based order. Safe and simple for a dataset
// this small. Deletion is a separate explicit call below, since an
// upsert of "what's currently in the list" can't express "this
// document should no longer exist."
export async function syncCategories(categories: AdminTeamCategory[]) {
  const batch = writeBatch(db);
  categories.forEach((category, index) => {
    batch.set(doc(db, CATEGORIES_COLLECTION, category.id), {
      name: category.name,
      teams: category.teams,
      order: index,
    });
  });
  await batch.commit();
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

export async function createMemberWithId(
  id: string,
  member: Omit<AdminMember, "id">,
  order: number,
) {
  await setDoc(doc(db, MEMBERS_COLLECTION, id), { ...member, order });
}

export async function updateMemberDoc(id: string, member: Omit<AdminMember, "id">) {
  await updateDoc(doc(db, MEMBERS_COLLECTION, id), { ...member });
}

export async function deleteMemberDoc(id: string) {
  await deleteDoc(doc(db, MEMBERS_COLLECTION, id));
}