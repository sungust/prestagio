/**
 * Agoda Partners. Every Agoda link on Prestagio is built here so it always
 * carries Prestagio's partner ID (site "prestagio.com", approved and active),
 * which is how bookings are attributed to us.
 */
export const AGODA_CID = "1953722";

const BASE = "https://www.agoda.com/partners/partnersearch.aspx";

/** Agoda city IDs for each Prestagio destination, from the Agoda Partners text-link tool. */
export const AGODA_CITIES: Record<string, { id: number; name: string }> = {
  amalfi: { id: 4569, name: "Positano" },
  capetown: { id: 1063, name: "Cape Town" },
  como: { id: 12575, name: "Como" },
  engadin: { id: 79579, name: "St. Moritz" },
  highlands: { id: 2836, name: "Fort William" },
  kyoto: { id: 1784, name: "Kyoto" },
  lisbon: { id: 16364, name: "Lisbon" },
  maldives: { id: 17759, name: "the Maldives" },
  marrakech: { id: 11825, name: "Marrakech" },
  paris: { id: 15470, name: "Paris" },
  riviera: { id: 77854, name: "Villefranche-sur-Mer" },
  venice: { id: 17164, name: "Venice" },
};

export interface AgodaSearch {
  hotel?: number;
  city?: number;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}

export function agodaUrl(s: AgodaSearch): string {
  const q = new URLSearchParams({ pcs: "1", cid: AGODA_CID });
  if (s.hotel) q.set("hid", String(s.hotel));
  else if (s.city) q.set("city", String(s.city));
  if (s.checkIn) q.set("checkIn", s.checkIn);
  if (s.checkOut) q.set("checkOut", s.checkOut);
  if (s.adults) q.set("adults", String(s.adults));
  if (s.children !== undefined) q.set("children", String(s.children));
  if (s.rooms) q.set("rooms", String(s.rooms));
  return `${BASE}?${q}`;
}
