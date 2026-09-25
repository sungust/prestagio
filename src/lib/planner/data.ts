import fs from "node:fs";
import path from "node:path";
import type { Airport, Aroma, Car, Destination, Mood, Watch } from "./types";

/**
 * The curated recommendation dataset. It lives in /content/planner as JSON so
 * editors can change it through the CMS without touching application code.
 */
export interface PlannerData {
  moods: Mood[];
  airports: Airport[];
  destinations: Destination[];
  cars: Car[];
  watches: Watch[];
  aromas: Aroma[];
}

const ROOT = path.join(process.cwd(), "content", "planner");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8")) as T;
}

let cache: PlannerData | null = null;

export function loadPlannerData(): PlannerData {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const destinations = fs
    .readdirSync(path.join(ROOT, "destinations"))
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => readJson<Destination>(path.join("destinations", f)));
  cache = {
    moods: readJson<{ moods: Mood[] }>("moods.json").moods,
    airports: readJson<{ airports: Airport[] }>("airports.json").airports,
    cars: readJson<{ cars: Car[] }>("cars.json").cars,
    watches: readJson<{ watches: Watch[] }>("watches.json").watches,
    aromas: readJson<{ aromas: Aroma[] }>("aromas.json").aromas,
    destinations,
  };
  return cache;
}
