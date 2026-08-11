import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const CATEGORIES = [
  "General Inquiry",
  "Membership / Joining",
  "Event Feedback",
  "Website Issue / Bug",
  "Suggestion or Idea",
  "Report a Concern",
  "Sponsorship / Partnership",
  "Other",
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: Request) {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const CONTACT_RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_RECIPIENT_EMAIL) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { name, email, category, customSubject, message, website, recaptchaToken } = body as {
    name?: string;
    email?: string;
    category?: string;
    customSubject?: string;
    message?: string;
    website?: string; // honeypot
    recaptchaToken?: string;
  };

  if (website) {
    return NextResponse.json({ ok: true }); // honeypot tripped — silently pretend success
  }

  if (!recaptchaToken) {
    return NextResponse.json({ error: "Please complete the reCAPTCHA." }, { status: 400 });
  }
  const recaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaValid) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed. Try again." },
      { status: 400 },
    );
  }

  if (!name?.trim() || !email?.trim() || !category || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (category === "Other" && !customSubject?.trim()) {
    return NextResponse.json(
      { error: "Please specify a subject for 'Other'." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const subject = category === "Other" ? customSubject!.trim() : category;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"CHAT Contact Form" <${GMAIL_USER}>`,
      to: CONTACT_RECIPIENT_EMAIL,
      replyTo: email.trim(),
      subject: `[CHAT Contact] ${subject}`,
      text: `From: ${name.trim()} <${email.trim()}>\nCategory: ${category}\n\n${message.trim()}`,
      html: `
        <p><strong>From:</strong> ${name.trim()} (${email.trim()})</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message.trim()}</p>
      `,
    });
  } catch (err) {
    console.error("send-contact failed:", err);
    return NextResponse.json({ error: "Failed to send. Try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}