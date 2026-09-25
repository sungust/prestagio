import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage, placeParam } from "@/components/CategoryPage";
import { loadPlannerData } from "@/lib/planner/data";

export const metadata: Metadata = {
  title: "Cars: Grand Touring and the Second Home on the Road",
  description: "Design, craftsmanship, grand touring and road trips, and when to hand the keys to a driver, a boat or a train.",
  alternates: { canonical: "/cars" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CarsPage({ searchParams }: Props) {
  const place = placeParam((await searchParams).place);
  const { destinations, cars } = loadPlannerData();
  return (
    <CategoryPage
      section="cars"
      place={place}
      plannerTitle="Find the road, then the car"
      plannerText="Choose “An iconic drive” in the Planner. Where driving is the pleasure, we suggest a car; where it isn't, a better way to travel."
      discovery={
        <section className="section section--tight" aria-labelledby="roads-title">
          <div className="wrap">
            <h2 id="roads-title" style={{ fontSize: 34, marginBottom: 6 }}>
              The right way to travel, place by place
            </h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
              A car is not always the answer. Here is how the Planner travels in each destination.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: "left", padding: "10px 12px 10px 0" }} className="label">Destination</th>
                    <th scope="col" style={{ textAlign: "left", padding: "10px 12px" }} className="label">For two</th>
                    <th scope="col" style={{ textAlign: "left", padding: "10px 12px" }} className="label">With family or friends</th>
                    <th scope="col" style={{ textAlign: "left", padding: "10px 0 10px 12px" }} className="label">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((d) => {
                    const name = (id?: string) => cars.find((c) => c.id === id)?.name;
                    const drive = d.driving.suitable && d.car;
                    return (
                      <tr key={d.id} style={{ borderTop: "1px solid var(--rule)" }}>
                        <th scope="row" style={{ textAlign: "left", padding: "12px 12px 12px 0", fontWeight: 600 }}>
                          <Link href={`/destinations/${d.id}`}>{d.name}</Link>
                        </th>
                        <td style={{ padding: 12 }}>{drive ? name(d.car!.couple) : d.transfer.label}</td>
                        <td style={{ padding: 12 }}>{drive ? name(d.car!.group) : d.transfer.label}</td>
                        <td style={{ padding: "12px 0 12px 12px", color: "var(--ink-2)" }}>{d.driving.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      }
    />
  );
}
