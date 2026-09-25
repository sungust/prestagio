import type { Metadata } from "next";
import { SearchCatalog } from "@/components/SearchCatalog";
import { getArticles, toMeta } from "@/lib/content/articles";
import { loadPlannerData } from "@/lib/planner/data";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true }, alternates: { canonical: "/search" } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SearchPage({ searchParams }: Props) {
  const q = (await searchParams).q;
  const places = loadPlannerData().destinations.map(({ id, name, country, tagline }) => ({ id, name, country, tagline }));
  return (
    <div className="wrap" style={{ maxWidth: 860, paddingBlock: "48px 96px" }}>
      <h1 style={{ fontSize: "clamp(40px,5vw,64px)", textTransform: "uppercase", marginBottom: 24 }}>Search</h1>
      <SearchCatalog articles={getArticles().map(toMeta)} places={places} initial={typeof q === "string" ? q.slice(0, 80) : ""} />
    </div>
  );
}
