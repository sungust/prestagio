"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AGODA_CITIES, agodaUrl } from "@/lib/agoda";
import { track } from "@/lib/analytics";
import { Arrow } from "./Icons";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Prestagio's own stay search, in the house style. It opens Agoda's results
 * for the chosen place and dates, always carrying Prestagio's partner ID.
 * With `place` it searches one destination; without, the visitor chooses.
 */
export function AgodaSearch({ place, title = "Find a stay", context }: { place?: string; title?: string; context: string }) {
  const id = useId();
  const today = isoDate(new Date());
  const [dest, setDest] = useState(place ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("2");
  const [rooms, setRooms] = useState("1");
  const city = dest ? AGODA_CITIES[dest] : undefined;
  const badDates = Boolean(checkIn && checkOut && checkOut <= checkIn);

  return (
    <form
      className="stay-search"
      onSubmit={(e) => {
        e.preventDefault();
        if (!city || badDates) return;
        track("affiliate_click", { id: `agoda-search-${dest}`, context });
        const url = agodaUrl({ city: city.id, checkIn: checkIn || undefined, checkOut: checkOut || undefined, adults: Number(adults), rooms: Number(rooms), children: 0 });
        window.open(url, "_blank", "noopener");
      }}
    >
      <div className="stay-search__head">
        <span className="kicker">Stays</span>
        <h2 className="stay-search__title">{city && place ? `${title} in ${city.name}` : title}</h2>
      </div>
      <div className="stay-search__fields">
        {place ? null : (
          <div className="stay-search__field">
            <label htmlFor={`${id}-dest`}>Destination</label>
            <select id={`${id}-dest`} value={dest} onChange={(e) => setDest(e.target.value)} required>
              <option value="">Choose a destination</option>
              {Object.entries(AGODA_CITIES).map(([k, c]) => (
                <option key={k} value={k}>
                  {c.name.replace(/^the /, "The ")}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="stay-search__field">
          <label htmlFor={`${id}-in`}>Check in</label>
          <input id={`${id}-in`} type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div className="stay-search__field">
          <label htmlFor={`${id}-out`}>Check out</label>
          <input
            id={`${id}-out`}
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            aria-invalid={badDates || undefined}
          />
        </div>
        <div className="stay-search__field">
          <label htmlFor={`${id}-adults`}>Guests</label>
          <select id={`${id}-adults`} value={adults} onChange={(e) => setAdults(e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "adult" : "adults"}
              </option>
            ))}
          </select>
        </div>
        <div className="stay-search__field">
          <label htmlFor={`${id}-rooms`}>Rooms</label>
          <select id={`${id}-rooms`} value={rooms} onChange={(e) => setRooms(e.target.value)}>
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "room" : "rooms"}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn stay-search__submit" disabled={!city || badDates}>
          See stays on Agoda <Arrow />
        </button>
      </div>
      {badDates ? <p className="hint">Check out must be after check in.</p> : null}
      <p className="affiliate__disclosure">
        Opens Agoda in a new tab. Affiliate link: Prestagio may earn a commission if you book, at no extra cost to you. Rates and availability are set by
        Agoda; Prestagio does not take bookings. <Link href="/disclosure">Learn more</Link>.
      </p>
    </form>
  );
}
