import type { Metadata } from "next";
import Link from "next/link";
import { Media } from "@/components/Media";
import { ArticleCard } from "@/components/Stories";
import { Arrow } from "@/components/Icons";
import { loadPlannerData } from "@/lib/planner/data";
import { getArticles, toMeta } from "@/lib/content/articles";
import { SECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Place guides, architecture and culture, considered itineraries and where to stay, from Lake Como to Kyoto.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  const { destinations } = loadPlannerData();
  const guides = getArticles({ section: "destinations" }).map(toMeta);
  return (
    <>
      <header className="wrap page-head">
        <span className="kicker kicker--bronze">Prestagio</span>
        <h1>Destinations</h1>
        <p className="lede">{SECTIONS.destinations.intro}</p>
      </header>
      <section className="section section--tight" aria-labelledby="places-title">
        <div className="wrap">
          <h2 id="places-title" className="sr-only">
            All destinations
          </h2>
          <div className="place-grid">
            {destinations.map((d) => (
              <Link key={d.id} href={`/destinations/${d.id}`} className="place">
                <Media image={d.image} decorative seed={d.id} sizes="(max-width: 600px) 100vw, 25vw" />
                <div className="place__body">
                  <span className="kicker" style={{ color: "rgba(251,246,238,.85)" }}>
                    {d.country}
                  </span>
                  <h3>{d.name}</h3>
                  <p>{d.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {guides.length ? (
        <section className="section section--tight" aria-labelledby="guides-title">
          <div className="wrap">
            <h2 id="guides-title" style={{ fontSize: 34, marginBottom: 24 }}>
              Place guides
            </h2>
            <div className="grid-cards">
              {guides.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="section section--tight">
        <div className="wrap planner-entry">
          <div>
            <span className="kicker">Not sure where?</span>
            <h2>Start with a feeling</h2>
            <p>The Planner suggests three distinct destinations that fit how you want to feel, when you can go, and who is coming.</p>
          </div>
          <Link href="/plan" className="btn">
            Design My Escape <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
