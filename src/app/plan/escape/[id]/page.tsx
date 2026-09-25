import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { ArticleCard } from "@/components/Stories";
import { AffiliateModule } from "@/components/AffiliateModule";
import { StayPhoto } from "@/components/StayPhoto";
import { AgodaSearch } from "@/components/AgodaSearch";
import { StepNav } from "@/components/planner/Planner";
import { EscapeActions } from "@/components/planner/EscapeActions";
import { journeyStyle, travelEffort } from "@/lib/planner/describe";
import { Arrow } from "@/components/Icons";
import { loadPlannerData } from "@/lib/planner/data";
import { escapeFor, MONTHS } from "@/lib/planner/engine";
import { decodeInput, encodeInput } from "@/lib/planner/query";
import { articlesBySlugs, toMeta } from "@/lib/content/articles";
import { narrateEscape } from "@/lib/planner/narrator";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const d = loadPlannerData().destinations.find((x) => x.id === id);
  if (!d) return {};
  return {
    title: `An escape to ${d.name}`,
    description: `${d.tagline} A complete Prestagio escape: where to stay, how to arrive, how to travel, and the finishing touches.`,
    alternates: { canonical: `/plan/escape/${d.id}` },
    // Personalised variants of the same escape are for sharing, not for search.
    robots: { index: false, follow: true },
    openGraph: { title: `An escape to ${d.name} · Prestagio`, description: d.tagline },
  };
}

export default async function EscapePage({ params, searchParams }: Props) {
  const { id } = await params;
  const input = decodeInput(await searchParams);
  const data = loadPlannerData();
  const escape = escapeFor(id, input, data);
  if (!escape) notFound();
  const d = escape.destination;
  const query = encodeInput(input);
  const sharePath = `/plan/escape/${d.id}${query ? `?${query}` : ""}`;
  const stories = articlesBySlugs(d.articles).map(toMeta);
  const effort = travelEffort(escape);
  const t = escape.transport;
  const narration = await narrateEscape(escape, input);

  return (
    <>
      <section className="escape-hero" aria-labelledby="escape-title">
        <Media image={d.image} priority seed={d.id} />
        <div className="wrap escape-hero__content">
          <span className="kicker">Your escape · {d.region}, {d.country}</span>
          <h1 id="escape-title">{d.name}</h1>
          <p>{d.tagline}</p>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 32 }}>
        <StepNav current={4} />
        <p className="no-print">
          <Link href={`/plan?${query}${query ? "&" : ""}step=3`} className="link-arrow">
            <span aria-hidden="true">←</span> Back to my three escapes
          </Link>
        </p>
      </div>

      <section className="section section--tight" aria-labelledby="why-title">
        <div className="wrap split">
          <div>
            <span className="kicker kicker--bronze">What makes it distinctive</span>
            <h2 id="why-title">Why this escape is yours</h2>
            <p className="lede">{d.distinctive}</p>
            {narration ? <p className="lede">{narration}</p> : null}
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            <ul className="reasons">
              {escape.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            {escape.cautions.length ? (
              <div className="notice notice--warn">
                <strong>Worth knowing.</strong>
                <ul className="reasons cautions" style={{ marginTop: 8 }}>
                  {escape.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="hint">
              <strong>Season:</strong> {d.seasonNote} Best months: {d.bestMonths.map((m) => MONTHS[m - 1]).join(", ")}.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="itinerary-title">
        <div className="wrap split">
          <div>
            <span className="kicker kicker--bronze">The itinerary</span>
            <h2 id="itinerary-title">
              {escape.days.length} days in {d.name}
            </h2>
            <p className="muted">
              A practical, unhurried outline to adapt as you like.
              {input.nights && input.nights > escape.days.length
                ? ` We have left the remaining ${input.nights - escape.days.length} day${input.nights - escape.days.length > 1 ? "s" : ""} free for you.`
                : ""}{" "}
              Check opening times and reservations before you go.
            </p>
          </div>
          <ol className="itinerary">
            {escape.days.map((day) => (
              <li key={day.title}>
                <div>
                  <h3>{day.title}</h3>
                  <p>{day.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="elements-title">
        <div className="wrap">
          <span className="kicker kicker--bronze">Every element</span>
          <h2 id="elements-title" style={{ fontSize: "clamp(32px, 3.4vw, 46px)", margin: "10px 0 28px" }}>
            How the escape comes together
          </h2>
          <div className="companions">
            <article className="companion companion--wide" aria-labelledby="stay-title">
              <StayPhoto affiliateId={d.stay.affiliateId} stayName={d.stay.name} context="escape" fallback={d.image} />
              <div className="companion__body">
                <span className="kicker">Stay · {d.stay.kind}</span>
                <h3 id="stay-title">{d.stay.name}</h3>
                <p className="muted">{d.stay.place}</p>
                <p>{d.stay.why}</p>
                <p className="hint">
                  This recommendation is based on research, not a visit. Confirm current details, rates and seasonal opening with the property.
                </p>
                <AffiliateModule id={d.stay.affiliateId} stayName={d.stay.name} context="escape" />
              </div>
            </article>

            <article className="companion" aria-labelledby="arrive-title">
              <Media image={{ scene: "jet", tone: "golden", alt: "" }} decorative seed={`arrive-${d.id}`} />
              <div className="companion__body">
                <span className="kicker">Arrive</span>
                <h3 id="arrive-title">{d.arrival.airports.map((a) => `${a.name} (${a.iata})`).join(" or ")}</h3>
                <p>{d.arrival.transfer}</p>
                <p className="muted">{d.arrival.groundNote}</p>
                <details className="journey-panel">
                  <summary>Journey details</summary>
                  <div className="journey-panel__body">
                    {escape.flight ? (
                      <dl>
                        <dt>From</dt>
                        <dd>{escape.flight.fromLabel}</dd>
                        <dt>To</dt>
                        <dd>
                          {escape.flight.toName} ({escape.flight.toIata})
                        </dd>
                        <dt>Distance</dt>
                        <dd>≈ {escape.flight.km.toLocaleString("en-GB")} km great-circle</dd>
                        <dt>Travel effort</dt>
                        <dd>{effort}</dd>
                      </dl>
                    ) : (
                      <p>Add a departure city in the Planner to see an approximate flying time.</p>
                    )}
                    <p className="hint">
                      Estimated from great-circle distance at an average of 800 km/h plus 30 minutes. It is not a schedule, and it does not
                      account for winds, routings or connections. We do not show fares, tolls or fuel costs because they change constantly. Check
                      them with airlines and operators.
                    </p>
                  </div>
                </details>
              </div>
            </article>

            <article className="companion" aria-labelledby="road-title">
              <Media image={{ scene: t.kind === "car" ? "road" : d.image.scene, tone: "golden", alt: "" }} decorative seed={`road-${d.id}`} />
              <div className="companion__body">
                {t.kind === "car" ? (
                  <>
                    <span className="kicker">Your second home on the road</span>
                    <h3 id="road-title">{t.car.name}</h3>
                    <p>{t.why}</p>
                    <p className="muted">{t.car.cabin}</p>
                    <p className="hint">{t.note}</p>
                    <p className="hint">
                      Prefer not to drive? {t.alsoTransfer.label}: {t.alsoTransfer.why}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="kicker">How to travel</span>
                    <h3 id="road-title">{t.transfer.label}</h3>
                    <p>{t.transfer.why}</p>
                    <p className="hint">
                      <strong>Why not a car?</strong> {t.note}
                    </p>
                  </>
                )}
                <Link href="/cars/second-home-on-the-road" className="link-arrow">
                  The second home on the road <Arrow />
                </Link>
              </div>
            </article>

            <article className="companion" aria-labelledby="watch-title">
              <Media image={{ scene: "watch", tone: "night", alt: "" }} decorative seed={`watch-${escape.watch.id}`} />
              <div className="companion__body">
                <span className="kicker">Time</span>
                <h3 id="watch-title">
                  {escape.watch.maker} {escape.watch.model}
                </h3>
                <p>{d.watchWhy}</p>
                <p className="muted">{escape.watch.note}</p>
                <p className="hint">An editorial suggestion, not an advertisement. The watch you already love is always the right one.</p>
              </div>
            </article>

            <article className="companion" aria-labelledby="aroma-title">
              <Media image={{ scene: "aroma", tone: "golden", alt: "" }} decorative seed={`aroma-${escape.aroma.id}`} />
              <div className="companion__body">
                <span className="kicker">Atmosphere</span>
                <h3 id="aroma-title">{escape.aroma.name}</h3>
                <ul className="notes" aria-label="Notes to look for">
                  {escape.aroma.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <p>{d.aromaWhy}</p>
                <p className="muted">
                  <strong>For the room:</strong> {escape.aroma.room}
                </p>
                {t.kind === "car" ? (
                  <p className="muted">
                    <strong>For the car:</strong> {escape.aroma.car}
                  </p>
                ) : null}
              </div>
            </article>
          </div>
          <AgodaSearch place={d.id} context="escape" />
        </div>
      </section>

      {stories.length ? (
        <section className="section section--tight" aria-labelledby="stories-title">
          <div className="wrap">
            <span className="kicker kicker--bronze">Read further</span>
            <h2 id="stories-title" style={{ fontSize: "clamp(32px, 3.4vw, 46px)", margin: "10px 0 28px" }}>
              The stories behind this escape
            </h2>
            <div className="grid-cards">
              {stories.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="save-title">
        <div className="wrap">
          <StepNav current={5} />
          <div className="escape-card-print">
            <Media image={d.image} decorative seed={`card-${d.id}`} />
            <div className="escape-card-print__body">
              <span className="kicker">A Prestagio escape</span>
              <h2 id="save-title">{d.name}</h2>
              <dl>
                <dt>Feeling</dt>
                <dd>{input.moods.length ? input.moods.map((m) => data.moods.find((x) => x.id === m)?.label).join(" · ") : "Open to anything"}</dd>
                <dt>When</dt>
                <dd>{input.month ? MONTHS[input.month - 1] : "Flexible"}{input.nights ? `, ${input.nights} nights` : ""}</dd>
                <dt>Stay</dt>
                <dd>
                  {d.stay.name}, {d.stay.place}
                </dd>
                <dt>Journey</dt>
                <dd>{journeyStyle(escape)}</dd>
                <dt>Time</dt>
                <dd>
                  {escape.watch.maker} {escape.watch.model}
                </dd>
                <dt>Atmosphere</dt>
                <dd>{escape.aroma.name}</dd>
                <dt>Days</dt>
                <dd>{escape.days.map((x) => x.title).join(" · ")}</dd>
              </dl>
            </div>
          </div>
          <EscapeActions id={d.id} name={d.name} path={sharePath} />
        </div>
      </section>
    </>
  );
}
