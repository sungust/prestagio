import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, placeParam } from "@/components/CategoryPage";
import { loadPlannerData } from "@/lib/planner/data";

export const metadata: Metadata = {
  title: "Watches: Makers, Movements and Occasions",
  description: "Makers, movements and design, and how the right watch belongs to a particular place or occasion.",
  alternates: { canonical: "/watches" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function WatchesPage({ searchParams }: Props) {
  const place = placeParam((await searchParams).place);
  const { destinations, watches } = loadPlannerData();
  return (
    <CategoryPage
      section="watches"
      place={place}
      plannerTitle="A watch for the occasion"
      plannerText="Every Prestagio escape suggests a watch that suits its setting, as an editorial finishing touch rather than a purchase."
      discovery={
        <section className="section section--tight" aria-labelledby="pairings-title">
          <div className="wrap">
            <h2 id="pairings-title" style={{ fontSize: 34, marginBottom: 24 }}>
              A watch for every escape
            </h2>
            <div className="grid-cards">
              {destinations.map((d) => {
                const w = watches.find((x) => x.id === d.watch);
                if (!w) return null;
                return (
                  <article key={d.id} className="card" style={{ borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
                    <span className="kicker">
                      <Link href={`/destinations/${d.id}`}>{d.name}</Link>
                    </span>
                    <h3 style={{ fontSize: 24 }}>
                      {w.maker} {w.model}
                    </h3>
                    <p>{d.watchWhy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      }
    />
  );
}
