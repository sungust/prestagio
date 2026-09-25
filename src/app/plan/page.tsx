import type { Metadata } from "next";
import { Suspense } from "react";
import { Planner } from "@/components/planner/Planner";
import { SavedEscapes } from "@/components/planner/SavedEscapes";
import { loadPlannerData } from "@/lib/planner/data";

export const metadata: Metadata = {
  title: "Design My Escape",
  description: "Describe how you want to feel, set your boundaries, and receive three thoughtfully assembled escapes: a stay, an arrival, the right way to travel and the finishing touches.",
  alternates: { canonical: "/plan" },
};

export default function PlanPage() {
  const data = loadPlannerData();
  const catalog = { destinations: data.destinations, airports: data.airports, cars: data.cars, watches: data.watches, aromas: data.aromas };
  return (
    <div className="wrap planner-shell">
      <Suspense fallback={<p className="muted">Loading the Planner…</p>}>
        <Planner moods={data.moods} catalog={catalog} />
      </Suspense>
      <SavedEscapes />
    </div>
  );
}
