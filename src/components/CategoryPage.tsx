import Link from "next/link";
import type { ReactNode } from "react";
import { ArticleCard, EmptyStories, StoryCard } from "./Stories";
import { Arrow } from "./Icons";
import { getArticles, toMeta } from "@/lib/content/articles";
import { loadPlannerData } from "@/lib/planner/data";
import { SECTIONS } from "@/lib/site";
import type { Section } from "@/lib/types";

/**
 * Shared landing page for Stays, Cars, Watches and Aroma: a featured story,
 * curated articles filterable by place, category-specific discovery and a
 * Planner entry point.
 */
export function CategoryPage({
  section,
  place,
  discovery,
  plannerTitle,
  plannerText,
}: {
  section: Exclude<Section, "destinations">;
  place?: string;
  discovery: ReactNode;
  plannerTitle: string;
  plannerText: string;
}) {
  const info = SECTIONS[section];
  const { destinations } = loadPlannerData();
  const all = getArticles({ section }).map(toMeta);
  const featured = all.find((a) => a.featured) ?? all[0];
  const placesWithStories = destinations.filter((d) => all.some((a) => a.destinations.includes(d.id)));
  const filtered = place ? all.filter((a) => a.destinations.includes(place)) : all.filter((a) => a !== featured);

  return (
    <>
      <header className="wrap page-head">
        <span className="kicker kicker--bronze">Prestagio</span>
        <h1>{info.title}</h1>
        <p className="lede">{info.intro}</p>
      </header>

      {featured && !place ? (
        <section className="section section--tight" aria-label="Featured story">
          <div className="wrap stories stories--single">
            <StoryCard article={featured} variant="feature" headingLevel={2} />
          </div>
        </section>
      ) : null}

      <section className="section section--tight" aria-labelledby="stories-title">
        <div className="wrap">
          <h2 id="stories-title" style={{ fontSize: 34, marginBottom: 18 }}>
            {place ? `Stories: ${destinations.find((d) => d.id === place)?.name ?? place}` : "More stories"}
          </h2>
          {placesWithStories.length > 1 ? (
            <ul className="filters" aria-label="Filter by destination">
              <li>
                <Link href={info.path} aria-current={!place ? "true" : undefined}>
                  All places
                </Link>
              </li>
              {placesWithStories.map((d) => (
                <li key={d.id}>
                  <Link href={`${info.path}?place=${d.id}`} aria-current={place === d.id ? "true" : undefined} scroll={false}>
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {filtered.length ? (
            <div className="grid-cards">
              {filtered.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : all.length ? (
            <p className="muted">{place ? "No stories for this place yet." : "More stories are on their way."}</p>
          ) : (
            <EmptyStories />
          )}
        </div>
      </section>

      {discovery}

      <section className="section section--tight">
        <div className="wrap">
          <div className="planner-entry">
            <div>
              <span className="kicker">The Prestagio Planner</span>
              <h2>{plannerTitle}</h2>
              <p>{plannerText}</p>
            </div>
            <Link href="/plan" className="btn">
              Design My Escape <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function placeParam(v: string | string[] | undefined) {
  const s = Array.isArray(v) ? v[0] : v;
  return s && /^[a-z0-9-]{2,40}$/.test(s) ? s : undefined;
}
