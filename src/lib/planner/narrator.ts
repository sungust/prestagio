import "server-only";
import type { Escape, PlannerInput } from "./types";

/**
 * Optional AI enhancement for escape pages.
 *
 * The Planner never depends on this: recommendations, reasons and itineraries
 * all come from the deterministic rules in engine.ts. When enabled, a model
 * may add one short, warmer paragraph, rephrasing only facts already in the
 * curated dataset. Cost controls:
 *   - off unless AI_ENHANCEMENT_ENABLED=true and ANTHROPIC_API_KEY is set
 *   - a daily request cap per server instance (AI_DAILY_REQUEST_CAP)
 *   - an in-memory cache keyed by destination + answers
 *   - a hard timeout; any failure returns null (the deterministic page stands)
 */
export interface EscapeNarrator {
  narrate(escape: Escape, input: PlannerInput): Promise<string | null>;
}

const deterministic: EscapeNarrator = { narrate: async () => null };

const cache = new Map<string, string | null>();
let day = "";
let used = 0;

function underCap(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    used = 0;
  }
  const cap = Number(process.env.AI_DAILY_REQUEST_CAP ?? 200);
  if (used >= cap) return false;
  used++;
  return true;
}

const anthropicNarrator: EscapeNarrator = {
  async narrate(escape, input) {
    const key = `${escape.destination.id}:${input.moods.join(".")}:${input.month ?? ""}:${input.party ?? ""}`;
    if (cache.has(key)) return cache.get(key)!;
    if (!underCap()) return null;
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ timeout: 8_000, maxRetries: 0 });
    const d = escape.destination;
    const facts = [d.distinctive, ...escape.reasons, `Stay: ${d.stay.name}, ${d.stay.place}.`, `Days: ${escape.days.map((x) => x.title).join("; ")}.`].join("\n");
    try {
      const response = await client.beta.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-opus-5",
        max_tokens: 400,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system:
          "You write for Prestagio, a restrained luxury travel publication. Write two sentences, at most 60 words, that make the facts provided feel personal. Use only the facts given. Never add prices, availability, ratings, awards, opening hours, quotes or first-hand experiences. No exclamation marks.",
        messages: [{ role: "user", content: `Facts:\n${facts}` }],
      } as Parameters<typeof client.beta.messages.create>[0]) as { stop_reason: string | null; content: { type: string; text?: string }[] };
      const text = response.stop_reason === "refusal" ? null : response.content.find((b) => b.type === "text")?.text?.trim() || null;
      cache.set(key, text);
      return text;
    } catch {
      return null;
    }
  },
};

export function getNarrator(): EscapeNarrator {
  return process.env.AI_ENHANCEMENT_ENABLED === "true" && process.env.ANTHROPIC_API_KEY ? anthropicNarrator : deterministic;
}

export function narrateEscape(escape: Escape, input: PlannerInput) {
  return getNarrator().narrate(escape, input);
}
