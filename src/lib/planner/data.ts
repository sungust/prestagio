import { CONTENT } from "@/lib/content/compiled";
import type { Airport, Aroma, Car, Destination, Mood, Watch } from "./types";

/**
 * The curated recommendation dataset. It lives in /content/planner as JSON so
 * editors can change it through the CMS without touching application code. It
 * is compiled into the build by scripts/build-content.ts.
 */
export interface PlannerData {
  moods: Mood[];
  airports: Airport[];
  destinations: Destination[];
  cars: Car[];
  watches: Watch[];
  aromas: Aroma[];
}

export function loadPlannerData(): PlannerData {
  return CONTENT.planner;
}
