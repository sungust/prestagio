import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { clientKey, emailConfigured, rateLimited, sendEmail, validEmail } from "@/lib/server/email";

export async function POST(req: Request) {
  if (!emailConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (rateLimited(`escape:${clientKey(req)}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { email?: unknown; path?: unknown; name?: unknown; marketingOptIn?: unknown } | null;
  if (!body || !validEmail(body.email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  const path = typeof body.path === "string" && /^\/plan\/escape\/[a-z0-9-]+(\?[\w.=&%-]*)?$/.test(body.path) ? body.path : null;
  if (!path) return NextResponse.json({ error: "invalid_path" }, { status: 400 });
  const name = typeof body.name === "string" ? body.name.slice(0, 80) : "your escape";

  const ok = await sendEmail(
    body.email,
    `Your escape to ${name}`,
    `Here is the escape you asked us to send:\n\n${SITE.url}${path}\n\nOpen the link to see the itinerary, stay, arrival and finishing touches. You can save or share it from there.\n\nPrestagio\n\nYou received this because you asked for it on prestagio.com. We will not email you again unless you opted in to our newsletter.`,
  );
  if (!ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });

  // Marketing consent is separate and explicit; it is only forwarded when ticked.
  if (body.marketingOptIn === true && process.env.NEWSLETTER_WEBHOOK_URL) {
    await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, source: "escape-email", consentedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => undefined);
  }
  return NextResponse.json({ ok: true });
}
