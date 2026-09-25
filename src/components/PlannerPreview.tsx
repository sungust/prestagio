"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Mood, MoodId } from "@/lib/planner/types";
import { track } from "@/lib/analytics";
import { MoodPicker } from "./MoodPicker";
import { Arrow } from "./Icons";

/**
 * The homepage entrance to the Planner: choose a feeling here, and the full
 * flow opens at the next step with those feelings already selected.
 */
export function PlannerPreview({ moods, children }: { moods: Mood[]; children: React.ReactNode }) {
  const router = useRouter();
  const [selected, setSelected] = useState<MoodId[]>([]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        track("plan_cta_click", { from: "home_preview", moods: selected.length });
        const q = new URLSearchParams({ step: selected.length ? "2" : "1" });
        if (selected.length) q.set("m", selected.join("."));
        router.push(`/plan?${q.toString()}`);
      }}
    >
      <MoodPicker moods={moods} selected={selected} onChange={setSelected} legend="Choose the feeling of your escape" />
      <div className="preview__foot">
        {children}
        <button type="submit" className="btn">
          {selected.length ? "Continue my escape" : "Design My Escape"} <Arrow />
        </button>
      </div>
    </form>
  );
}
