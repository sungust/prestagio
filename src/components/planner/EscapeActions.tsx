"use client";

import { useEffect, useId, useState } from "react";
import { track } from "@/lib/analytics";
import { readSaved, writeSaved } from "./saved";

type EmailState = "idle" | "open" | "sending" | "sent" | "unavailable" | "error";

export function EscapeActions({ id, name, path }: { id: string; name: string; path: string }) {
  const uid = useId();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [state, setState] = useState<EmailState>("idle");

  useEffect(() => {
    setSaved(readSaved().some((s) => s.url === path));
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [path]);

  const url = () => `${window.location.origin}${path}`;

  const save = () => {
    const list = readSaved().filter((s) => s.url !== path);
    if (saved) {
      writeSaved(list);
      setSaved(false);
      return;
    }
    writeSaved([{ id, name, url: path, savedAt: new Date().toISOString() }, ...list]);
    setSaved(true);
    track("escape_saved", { destination: id });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      track("escape_shared", { destination: id, method: "copy" });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link", url());
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: `An escape to ${name} · Prestagio`, url: url() });
      track("escape_shared", { destination: id, method: "native" });
    } catch {
      /* dismissed */
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/escape-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, path, name, marketingOptIn: optIn }),
      });
      if (res.status === 503) return setState("unavailable");
      if (!res.ok) return setState("error");
      track("escape_email_requested", { destination: id, marketing: optIn });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="no-print" style={{ marginTop: 28 }}>
      <div className="share-row">
        <button type="button" className="btn" onClick={save} aria-pressed={saved}>
          {saved ? "Saved to this device" : "Save this escape"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={copy}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        {canShare ? (
          <button type="button" className="btn btn--ghost" onClick={share}>
            Share
          </button>
        ) : null}
        <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
          Print or save as PDF
        </button>
        {state === "idle" ? (
          <button type="button" className="text-button" onClick={() => setState("open")}>
            Email me this escape
          </button>
        ) : null}
      </div>
      <p className="sr-only" role="status">
        {copied ? "Link copied to clipboard." : ""}
      </p>
      <p className="hint" style={{ marginTop: 12 }}>
        Saved escapes stay in this browser. Your answers live only in the link, so anyone you share it with sees the same escape.
      </p>

      {state !== "idle" ? (
        <form className="email-form" onSubmit={send} aria-labelledby={`${uid}-title`}>
          <h3 id={`${uid}-title`} style={{ fontSize: 26 }}>
            Email me this escape
          </h3>
          {state === "sent" ? (
            <p className="notice notice--ok" role="status">
              Sent. Check your inbox for a link to your escape to {name}.
            </p>
          ) : state === "unavailable" ? (
            <p className="notice notice--warn" role="status">
              Email delivery is not available right now. Please copy the link or save the escape instead.
            </p>
          ) : (
            <>
              <div className="field">
                <label htmlFor={`${uid}-email`}>Email address</label>
                <input
                  id={`${uid}-email`}
                  className="input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby={`${uid}-email-hint`}
                />
                <p className="hint" id={`${uid}-email-hint`}>
                  We use this address only to send this escape, once.
                </p>
              </div>
              <label className="check">
                <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
                <span>Also send me Prestagio&apos;s occasional newsletter. Optional; unsubscribe at any time.</span>
              </label>
              {state === "error" ? (
                <p className="notice notice--warn" role="alert">
                  Something went wrong. Please check the address and try again.
                </p>
              ) : null}
              <div className="share-row">
                <button type="submit" className="btn" disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Send"}
                </button>
                <button type="button" className="text-button" onClick={() => setState("idle")}>
                  Cancel
                </button>
              </div>
              <p className="hint">
                See our <a href="/privacy">privacy notice</a>.
              </p>
            </>
          )}
        </form>
      ) : null}
    </div>
  );
}
