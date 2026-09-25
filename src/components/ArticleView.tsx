import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Figure } from "./Media";
import { ArticleCard, ReviewBadge } from "./Stories";
import { AffiliateModule } from "./AffiliateModule";
import { ArticleEngagement } from "./ArticleEngagement";
import { JsonLd } from "./JsonLd";
import { Arrow } from "./Icons";
import { articlesBySlugs, getArticle, getArticles, toMeta } from "@/lib/content/articles";
import { articlePath } from "@/lib/content/paths";
import { getAffiliate } from "@/lib/content/affiliates";
import { loadPlannerData } from "@/lib/planner/data";
import { SECTIONS, absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/format";
import type { Section } from "@/lib/types";

export function articleParams(section: Section) {
  return getArticles({ section }).map((a) => ({ slug: a.slug, ...(section === "destinations" ? { place: a.destinations[0] } : {}) }));
}

export function articleMetadata(slug: string, section: Section): Metadata {
  const a = getArticle(slug);
  if (!a || a.section !== section) return {};
  const path = articlePath(a);
  return {
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.deck,
    alternates: { canonical: path },
    openGraph: { type: "article", title: a.title, description: a.deck, url: path, publishedTime: a.published, modifiedTime: a.updated ?? a.published },
    robots: a.status === "published" ? undefined : { index: false, follow: false },
  };
}

export function ArticleView({ slug, section, place }: { slug: string; section: Section; place?: string }) {
  const a = getArticle(slug);
  if (!a || a.section !== section || (place && a.destinations[0] !== place)) notFound();

  const { destinations } = loadPlannerData();
  const places = a.destinations.map((id) => destinations.find((d) => d.id === id)).filter((d): d is NonNullable<typeof d> => Boolean(d));
  const related = articlesBySlugs(a.related).map(toMeta);
  const sectionInfo = SECTIONS[a.section];
  const primary = places[0];

  return (
    <article>
      {a.status === "review" ? (
        <div className="review-ribbon" role="note">
          Preview: this story is in editorial review and is not yet published on prestagio.com.
        </div>
      ) : null}
      <header className="wrap article-head">
        <div className="card__meta" style={{ justifyContent: "center" }}>
          <Link href={sectionInfo.path} className="kicker kicker--bronze">
            {sectionInfo.label}
          </Link>
          {places.slice(0, 2).map((p) => (
            <Link key={p.id} href={`/destinations/${p.id}`} className="kicker">
              {p.name}
            </Link>
          ))}
        </div>
        <h1>{a.title}</h1>
        <p className="lede">{a.deck}</p>
        <div className="byline">
          <span>
            By <strong>{a.author}</strong>
          </span>
          {a.editor ? <span>Edited by {a.editor}</span> : null}
          <span>
            Published <time dateTime={a.published}>{formatDate(a.published)}</time>
          </span>
          {a.updated ? (
            <span>
              Updated <time dateTime={a.updated}>{formatDate(a.updated)}</time>
            </span>
          ) : null}
          <span>{a.readingMinutes} min read</span>
          {a.basis === "research" ? <span>Based on research</span> : null}
        </div>
      </header>

      <div className="wrap article-hero">
        <Figure image={a.hero} priority sizes="(max-width: 1280px) 100vw, 1200px" />
      </div>

      <div className="wrap article-body">
        <div className="prose">
          <div className="article-copy" dangerouslySetInnerHTML={{ __html: a.html }} />

          {a.affiliates.map((id) => {
            const aff = getAffiliate(id);
            return aff ? <AffiliateModule key={id} id={id} stayName={aff.label} context={`article:${a.slug}`} /> : null;
          })}

          <p className="basis-note" id="article-end">
            {a.basis === "research"
              ? "This story is based on research, including the sources listed below, rather than a first-hand visit. "
              : "This story is based on a first-hand visit by the author. "}
            Prestagio does not accept payment for coverage. Spotted something out of date?{" "}
            <Link href={`/contact?topic=correction&page=${encodeURIComponent(articlePath(a))}`}>Suggest a correction</Link>.
          </p>

          {a.sources.length ? (
            <section className="sources" aria-labelledby="sources-title">
              <h2 id="sources-title">Sources</h2>
              <ol>
                {a.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener">
                      {s.title}
                    </a>
                    {s.publisher ? <span className="muted"> · {s.publisher}</span> : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <aside className="article-aside" aria-label="Plan around this story">
          {primary ? (
            <div className="planner-entry" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <span className="kicker">Plan an escape</span>
                <h2 style={{ fontSize: 26 }}>{primary.name}, complete</h2>
                <p>{primary.tagline}</p>
              </div>
              <Link href={`/plan/escape/${primary.id}`} className="btn btn--sm">
                See the escape <Arrow />
              </Link>
            </div>
          ) : (
            <div className="planner-entry" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <span className="kicker">Plan an escape</span>
                <h2 style={{ fontSize: 26 }}>Three escapes, composed around you</h2>
              </div>
              <Link href="/plan" className="btn btn--sm">
                Design My Escape <Arrow />
              </Link>
            </div>
          )}
          <ReviewBadge status={a.status} />
        </aside>
      </div>

      {related.length ? (
        <section className="section section--tight" aria-labelledby="related-title">
          <div className="wrap">
            <h2 id="related-title" style={{ fontSize: 34, marginBottom: 24 }}>
              Continue the journey
            </h2>
            <div className="grid-cards">
              {related.map((r) => (
                <ArticleCard key={r.slug} article={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ArticleEngagement slug={a.slug} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.deck,
          datePublished: a.published,
          dateModified: a.updated ?? a.published,
          author: { "@type": "Organization", name: a.author },
          publisher: { "@type": "Organization", name: "Prestagio" },
          mainEntityOfPage: absoluteUrl(articlePath(a)),
          about: places.map((p) => ({ "@type": "Place", name: p.name })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Prestagio", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: sectionInfo.label, item: absoluteUrl(sectionInfo.path) },
            { "@type": "ListItem", position: 3, name: a.title, item: absoluteUrl(articlePath(a)) },
          ],
        }}
      />
    </article>
  );
}
