import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { ArticleCard } from "@/components/Stories";
import { AffiliateModule } from "@/components/AffiliateModule";
import { StayPhoto } from "@/components/StayPhoto";
import { AgodaSearch } from "@/components/AgodaSearch";
import { JsonLd } from "@/components/JsonLd";
import { Arrow } from "@/components/Icons";
import { loadPlannerData } from "@/lib/planner/data";
import { getArticles, toMeta } from "@/lib/content/articles";
import { MONTHS } from "@/lib/planner/engine";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ place: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return loadPlannerData().destinations.map((d) => ({ place: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { place } = await params;
  const d = loadPlannerData().destinations.find((x) => x.id === place);
  if (!d) return {};
  return { title: `${d.name}: Guide, Where to Stay and How to Arrive`, description: `${d.tagline} ${d.distinctive}`.slice(0, 300), alternates: { canonical: `/destinations/${d.id}` } };
}

export default async function PlacePage({ params }: Props) {
  const { place } = await params;
  const { destinations } = loadPlannerData();
  const d = destinations.find((x) => x.id === place);
  if (!d) notFound();
  const stories = getArticles({ destination: d.id }).map(toMeta);

  return (
    <>
      <section className="escape-hero" aria-labelledby="place-title">
        <Media image={d.image} priority seed={d.id} />
        <div className="wrap escape-hero__content">
          <span className="kicker">
            <Link href="/destinations">Destinations</Link> · {d.region}, {d.country}
          </span>
          <h1 id="place-title">{d.name}</h1>
          <p>{d.tagline}</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap split">
          <div>
            <span className="kicker kicker--bronze">Why go</span>
            <h2>What makes it distinctive</h2>
            <p className="lede">{d.distinctive}</p>
            <Link href={`/plan/escape/${d.id}`} className="btn" style={{ marginTop: 12 }}>
              See the complete escape <Arrow />
            </Link>
          </div>
          <dl className="facts" style={{ fontSize: 15.5, gap: "14px 24px" }}>
            <dt>Best months</dt>
            <dd>{d.bestMonths.map((m) => MONTHS[m - 1]).join(", ")}</dd>
            <dt>Seasons</dt>
            <dd>{d.seasonNote}</dd>
            <dt>Arrive</dt>
            <dd>
              {d.arrival.airports.map((a) => `${a.name} (${a.iata})`).join(" or ")}. {d.arrival.transfer}
            </dd>
            <dt>Getting around</dt>
            <dd>{d.driving.note}</dd>
            <dt>Ideal stay</dt>
            <dd>
              {d.idealNights[0]}–{d.idealNights[1]} nights
            </dd>
          </dl>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="stay-title">
        <div className="wrap companion companion--wide">
          <StayPhoto affiliateId={d.stay.affiliateId} stayName={d.stay.name} context={`destination:${d.id}`} fallback={d.image} />
          <div className="companion__body">
            <span className="kicker">Where we would stay</span>
            <h2 id="stay-title" style={{ fontSize: 34 }}>
              {d.stay.name}
            </h2>
            <p className="muted">{d.stay.place}</p>
            <p>{d.stay.why}</p>
            <p className="hint">This recommendation is based on research, not a visit. Confirm current details, rates and seasonal opening with the property.</p>
            <AffiliateModule id={d.stay.affiliateId} stayName={d.stay.name} context={`destination:${d.id}`} />
          </div>
        </div>
        <div className="wrap">
          <AgodaSearch place={d.id} context={`destination:${d.id}`} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="days-title">
        <div className="wrap split">
          <div>
            <span className="kicker kicker--bronze">Itinerary</span>
            <h2 id="days-title">Three days in {d.name}</h2>
            <p className="muted">Longer stays add more days in the Planner.</p>
          </div>
          <ol className="itinerary">
            {d.days.map((day) => (
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

      {stories.length ? (
        <section className="section section--tight" aria-labelledby="stories-title">
          <div className="wrap">
            <h2 id="stories-title" style={{ fontSize: 34, marginBottom: 24 }}>
              Stories from {d.name}
            </h2>
            <div className="grid-cards">
              {stories.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: d.name,
          description: d.distinctive,
          url: absoluteUrl(`/destinations/${d.id}`),
          containedInPlace: { "@type": "Country", name: d.country },
        }}
      />
    </>
  );
}
