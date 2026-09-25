import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, placeParam } from "@/components/CategoryPage";
import { loadPlannerData } from "@/lib/planner/data";

export const metadata: Metadata = {
  title: "Aroma: Room and Car Scent",
  description: "Considered scents for the room and the car: materials, composition and the atmosphere they carry with you.",
  alternates: { canonical: "/aroma" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AromaPage({ searchParams }: Props) {
  const place = placeParam((await searchParams).place);
  const { destinations, aromas } = loadPlannerData();
  return (
    <CategoryPage
      section="aroma"
      place={place}
      plannerTitle="Bring the atmosphere home"
      plannerText="Each escape pairs its destination with a composition of notes for the room, and for the car where there is one."
      discovery={
        <section className="section section--tight" aria-labelledby="compositions-title">
          <div className="wrap">
            <h2 id="compositions-title" style={{ fontSize: 34, marginBottom: 6 }}>
              Compositions by place
            </h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
              Notes to look for, not products to buy.
            </p>
            <div className="grid-cards">
              {destinations.map((d) => {
                const a = aromas.find((x) => x.id === d.aroma);
                if (!a) return null;
                return (
                  <article key={d.id} className="card" style={{ borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
                    <span className="kicker">
                      <Link href={`/destinations/${d.id}`}>{d.name}</Link>
                    </span>
                    <h3 style={{ fontSize: 24 }}>{a.name}</h3>
                    <ul className="notes" aria-label="Notes">
                      {a.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <p>{a.room}</p>
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
