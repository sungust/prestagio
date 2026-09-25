import type { ImageRef } from "@/lib/types";

export const MOOD_IDS = ["sea", "city", "art", "lifetime", "weekend", "wellness", "drive"] as const;
export type MoodId = (typeof MOOD_IDS)[number];

export const PARTIES = ["solo", "couple", "family", "friends"] as const;
export type Party = (typeof PARTIES)[number];

export type Budget = 1 | 2 | 3 | 4;

export interface Mood {
  id: MoodId;
  label: string;
  line: string;
  image: ImageRef;
}

export interface Airport {
  iata: string;
  city?: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Car {
  id: string;
  name: string;
  seats: number;
  character: string;
  cabin: string;
}

export interface Watch {
  id: string;
  maker: string;
  model: string;
  since?: number;
  note: string;
}

export interface Aroma {
  id: string;
  name: string;
  notes: string[];
  room: string;
  car: string;
}

export interface Day {
  title: string;
  text: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  /** Destinations sharing a group are never shown together in one reveal. */
  group: string;
  tagline: string;
  distinctive: string;
  image: ImageRef;
  moods: Record<MoodId, number>;
  moodNotes: Partial<Record<MoodId, string>>;
  bestMonths: number[];
  busyMonths: number[];
  quietMonths: number[];
  seasonNote: string;
  minNights: number;
  idealNights: [number, number];
  /** Editorial judgement of typical rates at the recommended level of stay: 1 considered … 4 without limit. Not a quote. */
  priceLevel: Budget;
  party: Record<Party, number>;
  arrival: { airports: Airport[]; transfer: string; groundNote: string };
  driving: { suitable: boolean; note: string };
  car: { couple: string; group: string } | null;
  carWhy?: string;
  transfer: { mode: string; label: string; why: string };
  stay: { name: string; place: string; kind: "hotel" | "resort" | "villa"; why: string; affiliateId?: string };
  watch: string;
  watchWhy: string;
  aroma: string;
  aromaWhy: string;
  days: Day[];
  moreDays: Day[];
  articles: string[];
}

export interface PlannerInput {
  moods: MoodId[];
  /** IATA code from the departure list, or free text we cannot estimate from. */
  from?: string;
  month?: number;
  nights?: number;
  party?: Party;
  budget?: Budget;
}

export interface FlightEstimate {
  fromLabel: string;
  toIata: string;
  toName: string;
  km: number;
  hours: number;
  band: "short" | "medium" | "long" | "ultra";
}

export type Transport =
  | { kind: "car"; car: Car; why: string; note: string; alsoTransfer: Destination["transfer"] }
  | { kind: "transfer"; transfer: Destination["transfer"]; note: string };

export interface Escape {
  destination: Destination;
  score: number;
  reasons: string[];
  cautions: string[];
  flight: FlightEstimate | null;
  days: Day[];
  transport: Transport;
  watch: Watch;
  aroma: Aroma;
}
