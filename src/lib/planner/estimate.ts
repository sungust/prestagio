import type { Airport, Destination, FlightEstimate } from "./types";

const EARTH_KM = 6371;

export function greatCircleKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

/**
 * Approximate non-stop flying time from great-circle distance.
 *
 * Model: an average block speed of 800 km/h plus 30 minutes for taxi, climb
 * and approach, rounded to the nearest half hour. It is an estimate of
 * travel effort, not a schedule: it ignores winds, routings and connections,
 * and does not claim that a direct flight operates.
 */
export function estimateFlight(from: Airport, dest: Destination): FlightEstimate | null {
  let best: FlightEstimate | null = null;
  for (const to of dest.arrival.airports) {
    const km = greatCircleKm(from, to);
    if (best && km >= best.km) continue;
    const hours = Math.max(0.5, Math.round((km / 800 + 0.5) * 2) / 2);
    const band = hours <= 3 ? "short" : hours <= 7 ? "medium" : hours <= 12 ? "long" : "ultra";
    best = { fromLabel: from.city ? `${from.city} (${from.iata})` : from.iata, toIata: to.iata, toName: to.name, km: Math.round(km), hours, band };
  }
  // Under ~250 km the airport is effectively local: a drive, not a flight.
  if (best && best.km < 250) return { ...best, hours: 0, band: "short" };
  return best;
}

export function formatHours(h: number): string {
  if (h === 0) return "no flight needed";
  const whole = Math.floor(h);
  return h % 1 ? `${whole}½ hours` : `${whole} hour${whole === 1 ? "" : "s"}`;
}
