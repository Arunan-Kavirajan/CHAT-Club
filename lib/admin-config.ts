// The only Google account allowed into /admin. Client-side check only —
// see the note in auth-gate.tsx about pairing this with real Firestore
// security rules once we build the write operations.
export const ALLOWED_ADMIN_EMAIL = "chat.club.srm@gmail.com";

export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  return email === ALLOWED_ADMIN_EMAIL;
}