"use client";

import { useRef, useState, type FormEvent } from "react";
import { HoverScramble } from "@/components/motion/hover-scramble";
import { ThemeSelect } from "@/components/ui/theme-select";
import { RecaptchaWidget, type RecaptchaHandle } from "@/components/contact/recaptcha-widget";
import { sendContactMessage, getContactCooldownRemaining, markContactSubmitted } from "@/lib/send-contact";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

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

const LINKEDIN_URL = "https://www.linkedin.com/company/chat-official";
const INSTAGRAM_URL = "https://www.instagram.com/chat.official__srm";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const recaptchaRef = useRef<RecaptchaHandle | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const cooldown = getContactCooldownRemaining();
    if (cooldown > 0) {
      setStatus("error");
      setErrorMsg(`Please wait ${Math.ceil(cooldown / 1000)}s before sending another message.`);
      return;
    }

    if (!recaptchaToken) {
      setStatus("error");
      setErrorMsg("Please complete the reCAPTCHA.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await sendContactMessage({
        name,
        email,
        category,
        customSubject,
        message,
        website,
        recaptchaToken,
      });
      markContactSubmitted();
      setStatus("success");
      setName("");
      setEmail("");
      setCategory("");
      setCustomSubject("");
      setMessage("");
      setRecaptchaToken("");
      recaptchaRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setRecaptchaToken("");
      recaptchaRef.current?.reset();
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-sm text-accent mb-4">GET IN TOUCH</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
        <HoverScramble>Ping // Command</HoverScramble>
      </h1>
      <p className="mt-5 text-foreground/70 max-w-xl">
        Send a packet. Await our handshake.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-sm text-foreground/60 hover:text-accent transition-colors"
        >
          <FaLinkedin size={18} /> LinkedIn
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-sm text-foreground/60 hover:text-accent transition-colors"
        >
          <FaInstagram size={18} /> Instagram
        </a>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-foreground/50">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border border-foreground/15 bg-muted/30 px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-foreground/50">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border border-foreground/15 bg-muted/30 px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-foreground/50">Category</span>
          <ThemeSelect
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
            placeholder="Select a category"
          />
        </label>

        {category === "Other" && (
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-foreground/50">Subject</span>
            <input
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              required
              placeholder="What's this about?"
              className="rounded-md border border-foreground/15 bg-muted/30 px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-foreground/50">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            maxLength={5000}
            className="rounded-md border border-foreground/15 bg-muted/30 px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-y"
          />
        </label>

        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 pointer-events-none h-0 w-0"
          aria-hidden="true"
        />

        <RecaptchaWidget
          onVerify={setRecaptchaToken}
          onExpire={() => setRecaptchaToken("")}
          widgetRef={recaptchaRef}
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="self-start font-mono text-sm px-5 py-3 rounded-md bg-accent text-background hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send message →"}
        </button>

        {status === "success" && (
          <p className="font-mono text-sm text-accent">
            Message sent — thanks for reaching out.
          </p>
        )}
        {status === "error" && (
          <p className="font-mono text-sm text-accent">{errorMsg}</p>
        )}
      </form>
    </section>
  );
}