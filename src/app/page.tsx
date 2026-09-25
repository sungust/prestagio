import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/SectionHead";
import { HomePlanner } from "@/components/HomePlanner";
import { TrackedLink } from "@/components/TrackedLink";
import { Arrow } from "@/components/Icons";
import { loadPlannerData } from "@/lib/planner/data";
import { PHOTOS, type Photo } from "@/lib/photos";

const STORIES: { kicker: string; title: string; line: string; href: string; label: string; photo: Photo }[] = [
  {
    kicker: "Destinations",
    title: "Lake Como, beyond the postcard",
    line: "Timeless villas, hidden shores and a slower, more meaningful way to experience Italy's most iconic lake.",
    href: "/plan/escape/como",
    label: "Explore Como",
    photo: PHOTOS.como,
  },
  {
    kicker: "Cars",
    title: "The arrival is part of the story",
    line: "From private terminals to the world's most remarkable roads, come further in exceptional cars — your second home on the road.",
    href: "/cars",
    label: "Explore the journey",
    photo: PHOTOS.arrival,
  },
  {
    kicker: "Stays",
    title: "A private shore in the Maldives",
    line: "Secluded villas, infinite horizons and a deeper kind of luxury.",
    href: "/plan/escape/maldives",
    label: "Explore the Maldives",
    photo: PHOTOS.maldives,
  },
];

const SEQUENCE: { n: string; title: string; line: string; href: string; photo: Photo }[] = [
  { n: "01", title: "Stay", line: "Extraordinary places to call home.", href: "/hotels", photo: PHOTOS.stay },
  { n: "02", title: "Arrive", line: "Seamless journeys from door to destination.", href: "/plan", photo: PHOTOS.arrive },
  { n: "03", title: "Drive", line: "Your second home on the road.", href: "/cars", photo: PHOTOS.drive },
  { n: "04", title: "Time", line: "A finer perspective on every moment.", href: "/watches", photo: PHOTOS.time },
  { n: "05", title: "Atmosphere", line: "Scents that travel with you.", href: "/aroma", photo: PHOTOS.atmosphere },
  { n: "06", title: "Explore", line: "Remarkable places, curated for deeper discovery.", href: "/destinations", photo: PHOTOS.explore },
];

function StoryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="home-story__link">
      {label} <Arrow />
    </Link>
  );
}

export default function HomePage() {
  const { airports } = loadPlannerData();
  const [lead, ...side] = STORIES;

  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill priority sizes="100vw" className="home-hero__img" />
        <div className="home-hero__shade" aria-hidden="true" />
        <div className="wrap home-hero__copy">
          <h1 id="hero-title">
            Go Somewhere
            <br /> Extraordinary
          </h1>
          <p>A journey shaped around where you stay, how you arrive, and everything you take with you.</p>
          <TrackedLink href="/plan" className="btn" event="hero_cta_click">
            Design My Escape <Arrow />
          </TrackedLink>
        </div>
      </section>

      <div className="wrap">
        <section className="home-planner" aria-labelledby="planner-title">
          <SectionHead id="planner-title" title="Your escape begins here" kicker="Five ways to explore the extraordinary" />
          <HomePlanner airports={airports} />
        </section>
      </div>

      <section className="home-stories" aria-labelledby="stories-title">
        <div className="wrap">
          <h2 id="stories-title" className="sr-only">
            Featured escapes
          </h2>
          <div className="home-stories__grid">
            <article className="home-story home-story--lead">
              <div className="home-story__media">
                <Image src={lead.photo.src} alt={lead.photo.alt} fill sizes="(max-width: 860px) 100vw, 53vw" />
              </div>
              <div className="home-story__body">
                <span className="kicker">{lead.kicker}</span>
                <h3>{lead.title}</h3>
                <p>{lead.line}</p>
                <StoryLink href={lead.href} label={lead.label} />
              </div>
            </article>
            <div className="home-stories__side">
              {side.map((s) => (
                <article key={s.href} className="home-story">
                  <div className="home-story__media">
                    <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(max-width: 860px) 100vw, 46vw" />
                  </div>
                  <div className="home-story__body">
                    <span className="kicker">{s.kicker}</span>
                    <h3>{s.title}</h3>
                    <p>{s.line}</p>
                    <StoryLink href={s.href} label={s.label} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-complete" aria-labelledby="complete-title">
        <div className="wrap">
          <SectionHead id="complete-title" title="A complete escape" kicker="Every element. A more extraordinary journey." />
          <ol className="home-sequence">
            {SEQUENCE.map((s) => (
              <li key={s.n}>
                <div className="home-sequence__media">
                  <Image src={s.photo.src} alt="" fill sizes="(max-width: 560px) 50vw, (max-width: 860px) 33vw, 16vw" />
                </div>
                <span className="home-sequence__n">{s.n}</span>
                <h3>
                  <Link href={s.href}>{s.title}</Link>
                </h3>
                <p>{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
