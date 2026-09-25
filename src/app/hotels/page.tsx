import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, placeParam } from "@/components/CategoryPage";
import { Media } from "@/components/Media";
import { loadPlannerData } from "@/lib/planner/data";

export const metadata: Metadata = {
  title: "Stays: Hotels, Resorts and Where to Stay",
  description: "Hotels, resorts and villas worth building a journey around, with guides to choosing the right shore, street or valley.",
  alternates: { canonical: "/hotels" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function HotelsPage({ searchParams }: Props) {
  const place = placeParam((await searchParams).place);
  const { destinations } = loadPlannerData();
  return (
    <CategoryPage
      section="hotels"
      place={place}
      plannerTitle="Build an escape around a stay"
      plannerText="Tell the Planner how you want to feel. Each escape starts with where you stay, then adds the arrival, the journey and the finishing touches."
      discovery={
        <section className="section section--tight" aria-labelledby="where-title">
          <div className="wrap">
            <h2 id="where-title" style={{ fontSize: 34, marginBottom: 6 }}>
              Where we would stay
            </h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
              One considered stay for each destination in the Planner. These are research-based recommendations, so always confirm details with the
              property.
            </p>
            <div className="grid-cards">
              {destinations.map((d) => (
                <article key={d.id} className="card">
                  <Media image={{ scene: d.stay.kind === "resort" ? "atoll" : "interior", tone: d.image.tone, alt: "" }} className="card__media" decorative seed={`stay-${d.id}`} />
                  <span className="kicker">
                    {d.stay.kind} · {d.name.includes(d.stay.place) ? d.name : `${d.stay.place}, ${d.name}`}
                  </span>
                  <h3>
                    <Link href={`/destinations/${d.id}`}>{d.stay.name}</Link>
                  </h3>
                  <p>{d.stay.why}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      }
    />
  );
}
