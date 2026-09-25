"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { Airport, MoodId, Party } from "@/lib/planner/types";
import { encodeInput } from "@/lib/planner/query";
import { MONTHS } from "@/lib/planner/engine";
import { PHOTOS, type Photo } from "@/lib/photos";
import { track } from "@/lib/analytics";
import { Arrow } from "./Icons";

const STYLES: { mood: MoodId; label: string; photo: Photo }[] = [
  { mood: "sea", label: "Sea & Solitude", photo: PHOTOS.sea },
  { mood: "city", label: "City & Culture", photo: PHOTOS.city },
  { mood: "drive", label: "Iconic Drives", photo: PHOTOS.drives },
  { mood: "wellness", label: "Wellness", photo: PHOTOS.wellness },
  { mood: "art", label: "Architecture", photo: PHOTOS.architecture },
];

const NIGHTS = [2, 3, 4, 5, 7, 10, 14];
const PARTIES: { value: Party; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];

const icon = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;
const PlaneIcon = () => (
  <svg {...icon}>
    <path d="M10.5 13.5 3 11l1.5-1.5 7 1 4-4.5c1-1 2.6-1.4 3.2-.8.6.6.2 2.2-.8 3.2l-4.5 4 1 7L13 21l-2.5-7.5z" />
  </svg>
);
const CalendarIcon = () => (
  <svg {...icon}>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);
const ClockIcon = () => (
  <svg {...icon}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
const PeopleIcon = () => (
  <svg {...icon}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <circle cx="17" cy="9.5" r="2.4" />
    <path d="M16 14.2c2.4.1 4 1.7 4.5 4.8" />
  </svg>
);

/**
 * The homepage's "Your escape begins here" panel: pick one or more escape
 * styles and a few boundaries, and the Planner opens with three escapes.
 */
export function HomePlanner({ airports }: { airports: Airport[] }) {
  const router = useRouter();
  const id = useId();
  const [moods, setMoods] = useState<MoodId[]>(["sea"]);
  const [from, setFrom] = useState("");
  const [month, setMonth] = useState("");
  const [nights, setNights] = useState("");
  const [party, setParty] = useState("");

  return (
    <form
      className="home-planner__form"
      onSubmit={(e) => {
        e.preventDefault();
        track("plan_cta_click", { from: "home_planner", moods: moods.length });
        const q = encodeInput({
          moods,
          from: from || undefined,
          month: month ? Number(month) : undefined,
          nights: nights ? Number(nights) : undefined,
          party: (party || undefined) as Party | undefined,
        });
        router.push(`/plan?${q}${q ? "&" : ""}step=${moods.length ? 3 : 1}`);
      }}
    >
      <fieldset className="home-styles">
        <legend className="sr-only">Choose the style of your escape (as many as you like)</legend>
        {STYLES.map((s) => {
          const checked = moods.includes(s.mood);
          return (
            <label key={s.mood} className="home-style">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  track("planner_mood_toggle", { mood: s.mood, on: !checked });
                  setMoods(checked ? moods.filter((m) => m !== s.mood) : [...moods, s.mood]);
                }}
              />
              <Image src={s.photo.src} alt="" fill sizes="(max-width: 700px) 60vw, 20vw" />
              <span className="home-style__label">{s.label}</span>
            </label>
          );
        })}
      </fieldset>

      <div className="home-fields">
        <div className="home-field">
          <label htmlFor={`${id}-from`}>Departing from</label>
          <div className="home-field__control">
            <PlaneIcon />
            <select id={`${id}-from`} value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Select airport or city</option>
              {airports.map((a) => (
                <option key={a.iata} value={a.iata}>
                  {a.city ?? a.name} ({a.iata})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="home-field">
          <label htmlFor={`${id}-month`}>When</label>
          <div className="home-field__control">
            <CalendarIcon />
            <select id={`${id}-month`} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Select dates</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="home-field">
          <label htmlFor={`${id}-nights`}>How long</label>
          <div className="home-field__control">
            <ClockIcon />
            <select id={`${id}-nights`} value={nights} onChange={(e) => setNights(e.target.value)}>
              <option value="">Any duration</option>
              {NIGHTS.map((n) => (
                <option key={n} value={n}>
                  {n} nights{n === 3 ? " · a long weekend" : n === 7 ? " · a week" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="home-field">
          <label htmlFor={`${id}-party`}>Traveling with</label>
          <div className="home-field__control">
            <PeopleIcon />
            <select id={`${id}-party`} value={party} onChange={(e) => setParty(e.target.value)}>
              <option value="">Solo, Couple, Family +</option>
              {PARTIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn home-fields__submit">
          Reveal my escapes <Arrow />
        </button>
      </div>
    </form>
  );
}
