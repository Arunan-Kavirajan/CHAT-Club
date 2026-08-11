const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY = "chat-contact-last-submit";

export function getContactCooldownRemaining(): number {
  const last = localStorage.getItem(COOLDOWN_KEY);
  if (!last) return 0;
  const elapsed = Date.now() - parseInt(last, 10);
  return Math.max(0, COOLDOWN_MS - elapsed);
}

export function markContactSubmitted() {
  localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
}

export type ContactPayload = {
  name: string;
  email: string;
  category: string;
  customSubject?: string;
  message: string;
  website?: string;
  recaptchaToken: string;
};

export async function sendContactMessage(payload: ContactPayload) {
  const response = await fetch("/api/send-contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to send.");
  }
}