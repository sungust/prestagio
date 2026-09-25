import { MOOD_IDS, PARTIES, type Budget, type MoodId, type Party, type PlannerInput } from "./types";

/**
 * Planner answers travel in the URL, so every result is a shareable link and
 * nothing about the visitor needs to be stored on our side.
 */
export function encodeInput(input: PlannerInput): string {
  const q = new URLSearchParams();
  if (input.moods.length) q.set("m", input.moods.join("."));
  if (input.from) q.set("from", input.from);
  if (input.month) q.set("mo", String(input.month));
  if (input.nights) q.set("n", String(input.nights));
  if (input.party) q.set("p", input.party);
  if (input.budget) q.set("b", String(input.budget));
  return q.toString();
}

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function get(params: Params, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

function int(v: string | undefined, min: number, max: number): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

export function decodeInput(params: Params): PlannerInput {
  const moods = (get(params, "m") ?? "")
    .split(/[.,]/)
    .filter((m): m is MoodId => (MOOD_IDS as readonly string[]).includes(m));
  const from = get(params, "from")?.trim().slice(0, 60) || undefined;
  const party = get(params, "p");
  return {
    moods: Array.from(new Set(moods)),
    from,
    month: int(get(params, "mo"), 1, 12),
    nights: int(get(params, "n"), 1, 30),
    party: (PARTIES as readonly string[]).includes(party ?? "") ? (party as Party) : undefined,
    budget: int(get(params, "b"), 1, 4) as Budget | undefined,
  };
}
