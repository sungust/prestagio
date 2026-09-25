"use client";

import { useId, useState } from "react";
import { SITE } from "@/lib/site";

const TOPICS = [
  { value: "general", label: "General enquiry" },
  { value: "correction", label: "Report a correction" },
  { value: "partnership", label: "Partnerships" },
  { value: "press", label: "Press" },
];

export function ContactForm({ topic = "general", page = "" }: { topic?: string; page?: string }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "unavailable" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setState(res.ok ? "sent" : res.status === 503 ? "unavailable" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") return <p className="notice notice--ok" role="status">Thank you. Your message has been sent, and we reply to every message that needs a reply.</p>;

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 22, maxWidth: 620 }}>
      <div className="field">
        <label htmlFor={`${id}-topic`}>Topic</label>
        <select id={`${id}-topic`} name="topic" className="select" defaultValue={TOPICS.some((t) => t.value === topic) ? topic : "general"}>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${id}-name`}>Name</label>
        <input id={`${id}-name`} name="name" className="input" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-email`}>Email (required)</label>
        <input id={`${id}-email`} name="email" type="email" required className="input" autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-message`}>Message (required)</label>
        <textarea id={`${id}-message`} name="message" required minLength={5} className="textarea" aria-describedby={`${id}-message-hint`} />
        <p className="hint" id={`${id}-message-hint`}>
          For corrections, tell us what is wrong and, if you can, a source.
        </p>
      </div>
      <input type="hidden" name="page" value={page} />
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          Leave this empty <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state === "unavailable" || state === "error" ? (
        <p className="notice notice--warn" role="alert">
          {state === "unavailable" ? "Our form is not available right now. " : "Something went wrong. "}
          Please email us at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      ) : null}
      <div>
        <button type="submit" className="btn" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
