import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AdminEvent } from "@/lib/event-types";

const EVENTS_COLLECTION = "events";

export function subscribeEvents(callback: (events: AdminEvent[]) => void) {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy("date", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name as string,
            date: (data.date ?? "") as string,
            time: (data.time ?? "") as string,
            location: (data.location ?? "") as string,
            description: (data.description ?? "") as string,
            thumbnailUrl: (data.thumbnailUrl ?? null) as string | null,
            photoUrls: (data.photoUrls || []) as string[],
            hosts: (data.hosts || []) as string[],
            folderSlug: (data.folderSlug ?? null) as string | null,
          };
        }),
      );
    },
    (error) => {
      console.error("subscribeEvents failed:", error.code, error.message);
    },
  );
}

export async function saveEvent(event: AdminEvent) {
  const { id, ...rest } = event;
  await setDoc(doc(db, EVENTS_COLLECTION, id), rest);
}

export async function deleteEventDoc(id: string) {
  await deleteDoc(doc(db, EVENTS_COLLECTION, id));
}