import { NextResponse } from "next/server";
import { clientKey, emailConfigured, rateLimited, sendEmail, validEmail } from "@/lib/server/email";

const TOPICS = new Set(["general", "correction", "partnership", "press"]);

export async function POST(req: Request) {
  if (!emailConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (rateLimited(`contact:${clientKey(req)}`, 5)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b || !validEmail(b.email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  // Honeypot: real visitors never fill this in.
  if (typeof b.website === "string" && b.website) return NextResponse.json({ ok: true });
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 5000) : "";
  if (message.length < 5) return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  const topic = typeof b.topic === "string" && TOPICS.has(b.topic) ? b.topic : "general";
  const name = typeof b.name === "string" ? b.name.slice(0, 120) : "";
  const page = typeof b.page === "string" ? b.page.slice(0, 300) : "";
  const ok = await sendEmail(
    process.env.CONTACT_TO || "hello@prestagio.com",
    `[Prestagio ${topic}] ${name || b.email}`,
    `From: ${name} <${b.email}>\nTopic: ${topic}\nPage: ${page}\n\n${message}`,
    b.email,
  );
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "send_failed" }, { status: 502 });
}
