import { jwtVerify, importX509, decodeProtectedHeader } from "jose";
import { ALLOWED_ADMIN_EMAIL } from "@/lib/admin-config";

// Verifying a Firebase ID token only requires Google's *public* signing
// certs — no service account or private key needed. This intentionally
// avoids firebase-admin, whose auth module currently pulls in jwks-rsa,
// which in turn pulls in an ESM-only version of `jose` that breaks under
// require() in Vercel's Node runtime. Verifying manually with `jose`
// directly sidesteps that whole broken chain.
const CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let cachedCerts: { certs: Record<string, string>; expiresAt: number } | null = null;

async function getGoogleCerts(): Promise<Record<string, string>> {
  if (cachedCerts && cachedCerts.expiresAt > Date.now()) {
    return cachedCerts.certs;
  }
  const res = await fetch(CERTS_URL);
  if (!res.ok) throw new Error("Failed to fetch Google certs");
  const certs = (await res.json()) as Record<string, string>;
  // Google rotates these periodically — cache conservatively.
  cachedCerts = { certs, expiresAt: Date.now() + 60 * 60 * 1000 };
  return certs;
}

type VerifyResult = { ok: true } | { ok: false; status: number; error: string };

export async function verifyAdminRequest(request: Request): Promise<VerifyResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "Missing authorization." };
  }
  const idToken = authHeader.slice("Bearer ".length);

  if (!PROJECT_ID) {
    return { ok: false, status: 500, error: "Server misconfigured." };
  }

  try {
    const { kid } = decodeProtectedHeader(idToken);
    if (!kid) return { ok: false, status: 401, error: "Invalid token." };

    const certs = await getGoogleCerts();
    const pem = certs[kid];
    if (!pem) return { ok: false, status: 401, error: "Invalid token." };

    const publicKey = await importX509(pem, "RS256");

    const { payload } = await jwtVerify(idToken, publicKey, {
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
    });

    if (payload.email !== ALLOWED_ADMIN_EMAIL) {
      return { ok: false, status: 403, error: "Unauthorized account." };
    }

    return { ok: true };
  } catch {
    return { ok: false, status: 401, error: "Invalid or expired session." };
  }
}