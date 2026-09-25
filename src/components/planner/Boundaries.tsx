"use client";

import { useEffect, useId, useState } from "react";
import { MONTHS, findAirport } from "@/lib/planner/engine";
import type { Airport, Budget, Party, PlannerInput } from "@/lib/planner/types";

const PARTY_OPTIONS: { value: Party | ""; label: string }[] = [
  { value: "", label: "Not decided" },
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];

const BUDGET_OPTIONS: { value: Budget | 0; label: string }[] = [
  { value: 0, label: "Prefer not to say" },
  { value: 1, label: "Considered · up to about €500 a night" },
  { value: 2, label: "Elevated · €500–1,000" },
  { value: 3, label: "Exceptional · €1,000–2,500" },
  { value: 4, label: "Without limit" },
];

const NIGHTS = [2, 3, 4, 5, 6, 7, 10, 14];

export function airportLabel(a: Airport) {
  return `${a.city ?? a.name} (${a.iata})`;
}

function parseFrom(text: string, airports: Airport[]): string | undefined {
  const t = text.trim();
  if (!t) return undefined;
  const code = t.match(/\(([A-Za-z]{3})\)\s*$/)?.[1] ?? t;
  return findAirport(airports, code)?.iata ?? t;
}

function nightsBetween(a: string, b: string): number | undefined {
  const start = Date.parse(a);
  const end = Date.parse(b);
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return undefined;
  return Math.round((end - start) / 86_400_000);
}

export function Boundaries({ input, airports, onChange }: { input: PlannerInput; airports: Airport[]; onChange: (next: PlannerInput) => void }) {
  const id = useId();
  const known = findAirport(airports, input.from);
  const [fromText, setFromText] = useState(known ? airportLabel(known) : (input.from ?? ""));
  const [dates, setDates] = useState({ start: "", end: "" });

  useEffect(() => {
    if (!dates.start) return;
    const nights = dates.end ? nightsBetween(dates.start, dates.end) : undefined;
    const month = new Date(`${dates.start}T12:00:00`).getMonth() + 1;
    onChange({ ...input, month, nights: nights ?? input.nights });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates.start, dates.end]);

  const set = (patch: Partial<PlannerInput>) => onChange({ ...input, ...patch });
  const unknownFrom = Boolean(input.from) && !known;
  const datesInvalid = Boolean(dates.start && dates.end) && nightsBetween(dates.start, dates.end) === undefined;

  return (
    <div className="bounds">
      <div className="field">
        <label htmlFor={`${id}-from`}>Departing from</label>
        <input
          id={`${id}-from`}
          className="input"
          list={`${id}-airports`}
          placeholder="City or airport, e.g. London (LHR)"
          autoComplete="off"
          value={fromText}
          onChange={(e) => {
            setFromText(e.target.value);
            set({ from: parseFrom(e.target.value, airports) });
          }}
          aria-describedby={`${id}-from-hint`}
        />
        <datalist id={`${id}-airports`}>
          {airports.map((a) => (
            <option key={a.iata} value={airportLabel(a)} />
          ))}
        </datalist>
        <p className="hint" id={`${id}-from-hint`} aria-live="polite">
          {unknownFrom
            ? `We can't estimate flying times from "${input.from}" yet, but your escapes will still be tailored to everything else.`
            : "Used only to estimate approximate flying time. We never show fares, which change by the hour."}
        </p>
      </div>

      <div className="field">
        <label htmlFor={`${id}-month`}>When</label>
        <select id={`${id}-month`} className="select" value={input.month ?? ""} onChange={(e) => set({ month: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">Any time / flexible</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <details>
          <summary className="hint" style={{ cursor: "pointer" }}>
            Or choose exact dates
          </summary>
          <div className="bounds" style={{ marginTop: 12, gap: 12 }}>
            <div className="field">
              <label htmlFor={`${id}-start`}>Arrive</label>
              <input id={`${id}-start`} type="date" className="input" value={dates.start} onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor={`${id}-end`}>Leave</label>
              <input
                id={`${id}-end`}
                type="date"
                className="input"
                min={dates.start || undefined}
                value={dates.end}
                aria-invalid={datesInvalid}
                aria-describedby={`${id}-dates-hint`}
                onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))}
              />
            </div>
          </div>
          <p className="hint" id={`${id}-dates-hint`} aria-live="polite">
            {datesInvalid ? "Your departure date needs to be after your arrival." : "We use your dates to set the month and trip length."}
          </p>
        </details>
      </div>

      <div className="field">
        <label htmlFor={`${id}-nights`}>How long</label>
        <select id={`${id}-nights`} className="select" value={input.nights ?? ""} onChange={(e) => set({ nights: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">Not sure yet</option>
          {Array.from(new Set([...NIGHTS, ...(input.nights ? [input.nights] : [])]))
            .sort((a, b) => a - b)
            .map((n) => (
              <option key={n} value={n}>
                {n} nights{n === 7 ? " · a week" : n === 3 ? " · a long weekend" : ""}
              </option>
            ))}
        </select>
        <p className="hint">Itineraries grow with longer stays. Without a length, we suggest three days.</p>
      </div>

      <fieldset className="field">
        <legend>Travelling with</legend>
        <div className="chips">
          {PARTY_OPTIONS.map((o) => (
            <label key={o.label} className="chip">
              <input type="radio" name={`${id}-party`} value={o.value} checked={(input.party ?? "") === o.value} onChange={() => set({ party: o.value || undefined })} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field field--wide">
        <legend>Comfortable budget for your stay</legend>
        <div className="chips">
          {BUDGET_OPTIONS.map((o) => (
            <label key={o.label} className="chip">
              <input type="radio" name={`${id}-budget`} value={o.value} checked={(input.budget ?? 0) === o.value} onChange={() => set({ budget: (o.value || undefined) as Budget | undefined })} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        <p className="hint">
          Nightly room rates for two. We compare your range with our editors&apos; sense of typical rates at each suggested stay. These are not live
          prices, and we will tell you when a stay usually sits above your range.
        </p>
      </fieldset>
    </div>
  );
}
