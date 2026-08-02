import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ALLOWED_ADMIN_EMAIL } from "@/lib/admin-config";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

type VerifyResult = { ok: true } | { ok: false; status: number; error: string };

// Verifies the request actually comes from your signed-in admin account,
// not just "someone hit the URL." The client sends its Firebase ID token
// in the Authorization header; this checks it's valid AND belongs to the
// one allowed email — the same check the client-side AuthGate does, but
// now enforced server-side where it actually matters.
export async function verifyAdminRequest(request: Request): Promise<VerifyResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "Missing authorization." };
  }
  const idToken = authHeader.slice("Bearer ".length);

  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
    if (decoded.email !== ALLOWED_ADMIN_EMAIL) {
      return { ok: false, status: 403, error: "Unauthorized account." };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 401, error: "Invalid or expired session." };
  }
}