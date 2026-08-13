import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type RecruitmentSettings = {
  open: boolean;
  formUrl: string;
};

export function subscribeRecruitment(callback: (settings: RecruitmentSettings) => void) {
  return onSnapshot(
    doc(db, "settings", "recruitment"),
    (snap) => {
      const data = snap.data();
      callback({
        open: (data?.open ?? false) as boolean,
        formUrl: (data?.formUrl ?? "") as string,
      });
    },
    (error) => {
      console.error("subscribeRecruitment failed:", error.code, error.message);
    },
  );
}

export async function saveRecruitment(settings: RecruitmentSettings) {
  await setDoc(doc(db, "settings", "recruitment"), settings);
}