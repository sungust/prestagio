"use client";

import Link from "next/link";
import type { Escape } from "@/lib/planner/types";
import { journeyStyle, travelEffort } from "@/lib/planner/describe";
import { track } from "@/lib/analytics";
import { Scene } from "@/components/Scene";
import { Arrow } from "@/components/Icons";

export function EscapeCard({ escape: e, index, query }: { escape: Escape; index: number; query: string }) {
  const d = e.destination;
  const href = `/plan/escape/${d.id}${query ? `?${query}` : ""}`;
  const effort = travelEffort(e);
  return (
    <article className="escape-card" aria-labelledby={`escape-${d.id}`}>
      <div className="escape-card__media media">
        <Scene kind={d.image.scene} tone={d.image.tone} seed={d.id} title={d.image.alt} />
        <div className="escape-card__title">
          <span className="escape-card__n">Escape {String(index + 1).padStart(2, "0")} · {d.country}</span>
          <h3 id={`escape-${d.id}`}>{d.name}</h3>
        </div>
      </div>
      <div className="escape-card__body">
        <p className="escape-card__tagline">{d.tagline}</p>
        <div>
          <h4>Why it fits you</h4>
          <ul className="reasons">
            {e.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        {e.cautions.length ? (
          <div>
            <h4>Worth knowing</h4>
            <ul className="reasons cautions">
              {e.cautions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div>
          <h4>Three days</h4>
          <ol className="mini-days">
            {e.days.slice(0, 3).map((day, i) => (
              <li key={day.title}>
                <b>Day {i + 1}.</b> {day.title}
              </li>
            ))}
            {e.days.length > 3 ? <li className="muted">+ {e.days.length - 3} more day{e.days.length - 3 > 1 ? "s" : ""} for your longer stay</li> : null}
          </ol>
        </div>
        <dl className="facts">
          <dt>Stay</dt>
          <dd>
            {d.stay.name}, {d.stay.place}
          </dd>
          <dt>Journey</dt>
          <dd>{journeyStyle(e)}</dd>
          {effort ? (
            <>
              <dt>Travel</dt>
              <dd>{effort}</dd>
            </>
          ) : null}
        </dl>
      </div>
      <div className="escape-card__foot">
        <Link href={href} className="btn" onClick={() => track("escape_opened", { destination: d.id, position: index + 1 })}>
          Explore this escape <Arrow />
        </Link>
      </div>
    </article>
  );
}
