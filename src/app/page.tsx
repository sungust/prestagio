import Link from "next/link";
import { Scene } from "@/components/Scene";
import { Media } from "@/components/Media";
import { SectionHead } from "@/components/SectionHead";
import { StoryCard, ArticleCard } from "@/components/Stories";
import { PlannerPreview } from "@/components/PlannerPreview";
import { TrackedLink } from "@/components/TrackedLink";
import { Arrow } from "@/components/Icons";
import { getArticles, toMeta } from "@/lib/content/articles";
import { loadPlannerData } from "@/lib/planner/data";
import type { ArticleMeta, ImageRef } from "@/lib/types";

const FEATURE_ORDER = ["lake-como-beyond-the-postcard", "the-arrival-is-part-of-the-story", "a-private-shore-in-the-maldives"];

const SEQUENCE: { n: string; title: string; line: string; href: string; image: ImageRef }[] = [
  { n: "01", title: "Stay", line: "Extraordinary places to call home.", href: "/hotels", image: { scene: "interior", tone: "dusk", alt: "" } },
  { n: "02", title: "Arrive", line: "Seamless journeys from door to destination.", href: "/cars/the-arrival-is-part-of-the-story", image: { scene: "jet", tone: "golden", alt: "" } },
  { n: "03", title: "Drive", line: "Your second home on the road.", href: "/cars/second-home-on-the-road", image: { scene: "road", tone: "golden", alt: "" } },
  { n: "04", title: "Time", line: "A finer perspective on every moment.", href: "/watches", image: { scene: "watch", tone: "night", alt: "" } },
  { n: "05", title: "Atmosphere", line: "Scents that travel with you.", href: "/aroma", image: { scene: "aroma", tone: "golden", alt: "" } },
  { n: "06", title: "Explore", line: "Remarkable places, curated for deeper discovery.", href: "/destinations", image: { scene: "coast", tone: "day", alt: "" } },
];

const ENTRANCES: { title: string; line: string; href: string; label: string; image: ImageRef }[] = [
  { title: "Stays", line: "Hotels, resorts and villas worth building a journey around.", href: "/hotels", label: "Explore stays", image: { scene: "atoll", tone: "golden", alt: "" } },
  { title: "Cars", line: "Grand touring, design and the second home on the road.", href: "/cars", label: "Explore cars", image: { scene: "alpine", tone: "golden", alt: "" } },
  { title: "Watches", line: "Makers, movements, and a piece for every occasion.", href: "/watches", label: "Explore watches", image: { scene: "watch", tone: "night", alt: "" } },
  { title: "Aroma", line: "Considered scents for the room and the road.", href: "/aroma", label: "Explore aroma", image: { scene: "aroma", tone: "dusk", alt: "" } },
];

export default function HomePage() {
  const { moods } = loadPlannerData();
  const articles = getArticles().map(toMeta);
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const lead: ArticleMeta[] = FEATURE_ORDER.map((s) => bySlug.get(s)).filter((a): a is ArticleMeta => Boolean(a));
  for (const a of articles) if (lead.length < 3 && !lead.includes(a)) lead.push(a);
  const more = articles.filter((a) => !lead.includes(a)).slice(0, 3);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media">
          <Scene kind="coast" tone="dusk" seed="prestagio-hero" focus="right" title="Illustration of a cliffside coast at sunset, with a terrace above a calm sea" />
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="wrap hero__content">
          <h1 id="hero-title">Go Somewhere Extraordinary</h1>
          <p>A journey shaped around where you stay, how you arrive, and everything you take with you.</p>
          <TrackedLink href="/plan" className="btn" event="hero_cta_click">
            Design My Escape <Arrow />
          </TrackedLink>
        </div>
      </section>

      <div className="wrap">
        <section className="preview" aria-labelledby="preview-title">
          <SectionHead id="preview-title" title="Your escape begins here" kicker="Choose a feeling, or several" />
          <PlannerPreview moods={moods}>
            <ol className="preview__next" aria-label="What happens next">
              <li>Set your boundaries</li>
              <li>Reveal three escapes</li>
              <li>Explore, save and share</li>
            </ol>
          </PlannerPreview>
        </section>
      </div>

      {lead.length ? (
        <section className="section" aria-labelledby="stories-title">
          <div className="wrap">
            <h2 id="stories-title" className="sr-only">
              Featured stories
            </h2>
            <div className="stories">
              <StoryCard article={lead[0]} variant="feature" />
              {lead.length > 1 ? (
                <div className="stories__side">
                  {lead.slice(1, 3).map((a) => (
                    <StoryCard key={a.slug} article={a} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className={lead.length ? "section section--tight" : "section"} aria-labelledby="complete-title">
        <div className="wrap">
          <SectionHead id="complete-title" title="A complete escape" kicker="Every element. A more extraordinary journey." />
          <ol className="sequence">
            {SEQUENCE.map((s) => (
              <li key={s.n}>
                <Media image={s.image} decorative seed={s.title} sizes="(max-width: 560px) 50vw, 16vw" />
                <span className="sequence__n">{s.n}</span>
                <h3>
                  <Link href={s.href}>{s.title}</Link>
                </h3>
                <p>{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {more.length ? (
        <section className="section" aria-labelledby="more-title">
          <div className="wrap">
            <SectionHead id="more-title" title="Places, pieces and passages" kicker="Recently published" />
            <div className="grid-cards">
              {more.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="entrances-title">
        <div className="wrap">
          <SectionHead id="entrances-title" title="Enter the collection" kicker="Stays · Cars · Watches · Aroma" />
          <div className="entrances">
            {ENTRANCES.map((e) => (
              <Link key={e.href} href={e.href} className="entrance">
                <Media image={e.image} decorative seed={`entrance-${e.title}`} sizes="(max-width: 520px) 100vw, 25vw" />
                <div className="entrance__body">
                  <h3>{e.title}</h3>
                  <p>{e.line}</p>
                  <span className="link-arrow">
                    {e.label} <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="band-title">
        <Media image={{ scene: "lake", tone: "dusk", alt: "" }} decorative seed="band" />
        <div className="wrap">
          <div className="band__inner">
            <span className="kicker">The Prestagio Planner</span>
            <h2 id="band-title">Three escapes, composed around you</h2>
            <p>
              Tell us how you want to feel and what matters. We will suggest three distinct journeys, each with a stay, an arrival, the right way
              to travel and the finishing touches, and explain why each one fits.
            </p>
            <TrackedLink href="/plan" className="btn btn--light" event="plan_cta_click" eventProps={{ from: "home_band" }}>
              Design My Escape <Arrow />
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
