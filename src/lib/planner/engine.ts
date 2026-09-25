import { estimateFlight, formatHours } from "./estimate";
import type { Airport, Aroma, Car, Day, Destination, Escape, MoodId, Party, PlannerInput, Transport, Watch } from "./types";

/**
 * Deterministic, transparent matching rules.
 *
 * Every point a destination gains or loses comes from a rule below, and each
 * rule adds a human-readable reason or caution, so the explanation a visitor
 * reads is the scoring itself rather than a story written afterwards.
 *
 *   mood      +4 per point of fit (0–3) for each chosen feeling
 *             −6 if none of the chosen feelings is a strong fit (≥ 2)
 *   season    +4 best months · −1 busiest months · −8 months when many stays close
 *   length    +3 within the ideal length · −3 per night short of the minimum
 *   budget    +1 within range · −4 per level above the visitor's comfortable range
 *   party     +2 strong fit · −6 poor fit
 *   distance  −6 for a flight over 7 h on a trip of 3 nights or fewer
 *             −4 for a flight over 10 h on a trip of 4–5 nights
 *             −4 for a flight over 5 h when "long weekend" is chosen
 *
 * Diversity: results never share a destination group (for example two Italian
 * lakes) and are penalised for sharing a country or dominant character, so
 * the three escapes are genuinely different journeys.
 */

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PARTY_PHRASE: Record<Party, string> = {
  solo: "travelling alone",
  couple: "two",
  family: "a family",
  friends: "a group of friends",
};

export interface Catalog {
  destinations: Destination[];
  airports: Airport[];
  cars: Car[];
  watches: Watch[];
  aromas: Aroma[];
}

interface Scored {
  destination: Destination;
  score: number;
  reasons: string[];
  cautions: string[];
  flight: ReturnType<typeof estimateFlight>;
  character: MoodId | null;
}

export function findAirport(airports: Airport[], from?: string): Airport | undefined {
  if (!from) return undefined;
  const key = from.trim().toUpperCase();
  return airports.find((a) => a.iata === key) ?? airports.find((a) => a.city?.toUpperCase() === key);
}

export function scoreDestination(d: Destination, input: PlannerInput, airports: Airport[]): Scored {
  let score = 0;
  const reasons: string[] = [];
  const cautions: string[] = [];
  const moods = input.moods;

  // Mood fit
  let strongest: { id: MoodId; v: number } | null = null;
  if (moods.length) {
    for (const m of moods) {
      const v = d.moods[m] ?? 0;
      score += v * 4;
      if (v >= 2 && d.moodNotes[m]) reasons.push(d.moodNotes[m]!);
      if (!strongest || v > strongest.v) strongest = { id: m, v };
    }
    if (!strongest || strongest.v < 2) score -= 6;
  } else {
    // No feeling chosen: favour destinations with broad appeal.
    const values = Object.values(d.moods);
    score += values.reduce((a, b) => a + b, 0);
    const top = (Object.entries(d.moods) as [MoodId, number][]).sort((a, b) => b[1] - a[1])[0];
    strongest = { id: top[0], v: top[1] };
    if (d.moodNotes[top[0]]) reasons.push(d.moodNotes[top[0]]!);
  }

  // Season
  if (input.month) {
    const name = MONTHS[input.month - 1];
    if (d.quietMonths.includes(input.month)) {
      score -= 8;
      cautions.push(`${name} is out of season here: ${d.seasonNote}`);
    } else if (d.bestMonths.includes(input.month)) {
      score += 4;
      reasons.push(`${name} is one of the best months to go.`);
    }
    if (d.busyMonths.includes(input.month)) {
      score -= 1;
      cautions.push(`${name} is among the busiest months. Book early, and plan the famous sights for first thing in the morning.`);
    }
  }

  // Trip length
  if (input.nights) {
    const [lo, hi] = d.idealNights;
    if (input.nights < d.minNights) {
      score -= 3 * (d.minNights - input.nights);
      cautions.push(`It is at its best with at least ${d.minNights} nights, and ${input.nights} would feel rushed.`);
    } else if (input.nights >= lo && input.nights <= hi) {
      score += 3;
      reasons.push(`${input.nights} nights is an ideal length here.`);
    }
  }

  // Budget
  if (input.budget) {
    const over = d.priceLevel - input.budget;
    if (over > 0) {
      score -= 4 * over;
      cautions.push("The stay we suggest usually sits above your comfortable range. Consider shoulder season or a shorter stay.");
    } else {
      score += 1;
    }
  }

  // Travel party
  if (input.party) {
    const fit = d.party[input.party];
    if (fit >= 2) {
      score += 2;
      reasons.push(`It works beautifully for ${PARTY_PHRASE[input.party]}.`);
    } else if (fit === 0) {
      score -= 6;
      cautions.push(`It is less suited to ${PARTY_PHRASE[input.party]}.`);
    }
  }

  // Distance
  const airport = findAirport(airports, input.from);
  const flight = airport ? estimateFlight(airport, d) : null;
  if (flight) {
    const n = input.nights;
    if (n && n <= 3 && flight.hours > 7) {
      score -= 6;
      cautions.push(`Roughly ${formatHours(flight.hours)} flying each way is a lot for ${n} night${n === 1 ? "" : "s"}.`);
    } else if (n && n <= 5 && flight.hours > 10) {
      score -= 4;
      cautions.push(`At roughly ${formatHours(flight.hours)} each way, a longer stay would make the journey more worthwhile.`);
    }
    if (moods.includes("weekend") && flight.hours > 5) score -= 4;
    if (flight.hours > 0 && flight.hours <= 3) reasons.push(`It is a short flight from ${flight.fromLabel}, roughly ${formatHours(flight.hours)} non-stop.`);
    if (flight.hours === 0) reasons.push(`It is close to ${flight.fromLabel}, so you can arrive by road or rail.`);
  }

  return { destination: d, score, reasons: dedupe(reasons), cautions: dedupe(cautions), flight, character: strongest?.id ?? null };
}

function dedupe(list: string[]) {
  return Array.from(new Set(list));
}

/** Pick `count` genuinely distinct escapes from scored candidates. */
export function pickDistinct(scored: Scored[], count = 3): Scored[] {
  const pool = [...scored].sort((a, b) => b.score - a.score || a.destination.id.localeCompare(b.destination.id));
  const picked: Scored[] = [];
  while (picked.length < count && pool.length) {
    let bestIdx = -1;
    let bestAdj = -Infinity;
    pool.forEach((c, i) => {
      if (picked.some((p) => p.destination.group === c.destination.group)) return;
      let adj = c.score;
      if (picked.some((p) => p.destination.country === c.destination.country)) adj -= 6;
      if (picked.some((p) => p.character && p.character === c.character)) adj -= 3;
      if (adj > bestAdj) {
        bestAdj = adj;
        bestIdx = i;
      }
    });
    if (bestIdx < 0) break;
    picked.push(pool.splice(bestIdx, 1)[0]);
  }
  return picked;
}

/** Adapt the three-day core itinerary to the visitor's trip length. */
export function adaptDays(d: Destination, nights?: number): Day[] {
  const extra = Math.max(0, (nights ?? 3) - 3);
  return [...d.days, ...d.moreDays.slice(0, extra)];
}

export function chooseTransport(d: Destination, catalog: Pick<Catalog, "cars">, party?: Party): Transport {
  if (d.driving.suitable && d.car) {
    const needsRoom = party === "family" || party === "friends";
    const id = needsRoom ? d.car.group : d.car.couple;
    const car = catalog.cars.find((c) => c.id === id);
    if (car) return { kind: "car", car, why: d.carWhy ?? car.character, note: d.driving.note, alsoTransfer: d.transfer };
  }
  return { kind: "transfer", transfer: d.transfer, note: d.driving.note };
}

export function buildEscape(scored: Scored, input: PlannerInput, catalog: Catalog): Escape {
  const d = scored.destination;
  const watch = catalog.watches.find((w) => w.id === d.watch);
  const aroma = catalog.aromas.find((a) => a.id === d.aroma);
  if (!watch || !aroma) throw new Error(`Destination ${d.id} references a missing watch or aroma`);
  return {
    destination: d,
    score: scored.score,
    reasons: scored.reasons.slice(0, 4),
    cautions: scored.cautions,
    flight: scored.flight,
    days: adaptDays(d, input.nights),
    transport: chooseTransport(d, catalog, input.party),
    watch,
    aroma,
  };
}

export function recommend(input: PlannerInput, catalog: Catalog, count = 3): Escape[] {
  const scored = catalog.destinations.map((d) => scoreDestination(d, input, catalog.airports));
  return pickDistinct(scored, count).map((s) => buildEscape(s, input, catalog));
}

export function escapeFor(destinationId: string, input: PlannerInput, catalog: Catalog): Escape | null {
  const d = catalog.destinations.find((x) => x.id === destinationId);
  if (!d) return null;
  return buildEscape(scoreDestination(d, input, catalog.airports), input, catalog);
}
