import "server-only";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validEmail(v: unknown): v is string {
  return typeof v === "string" && v.length <= 254 && EMAIL_RE.test(v);
}

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Sends a transactional email via Resend's HTTP API. Returns false on any failure. */
export async function sendEmail(to: string, subject: string, text: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || "Prestagio <escapes@prestagio.com>", to: [to], subject, text, reply_to: replyTo }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Very small fixed-window limiter per instance; a platform firewall should back this up. */
const hits = new Map<string, { n: number; t: number }>();
export function rateLimited(key: string, max = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > max;
}

export function clientKey(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
}
