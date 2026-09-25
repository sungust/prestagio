"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { decodeInput, encodeInput } from "@/lib/planner/query";
import { recommend, type Catalog } from "@/lib/planner/engine";
import type { Mood, PlannerInput } from "@/lib/planner/types";
import { track } from "@/lib/analytics";
import { MoodPicker } from "@/components/MoodPicker";
import { Arrow } from "@/components/Icons";
import { Boundaries } from "./Boundaries";
import { EscapeCard } from "./EscapeCard";

export const STEP_LABELS = ["Choose the feeling", "Set the boundaries", "Reveal three escapes", "Explore an escape", "Save or share"];

export function StepNav({ current }: { current: number }) {
  return (
    <ol className="steps" aria-label="Planner progress">
      {STEP_LABELS.map((label, i) => (
        <li key={label} aria-current={current === i + 1 ? "step" : undefined} data-done={i + 1 < current}>
          {label}
        </li>
      ))}
    </ol>
  );
}

/**
 * Steps 1–3 of the Planner. All answers live in the URL (via the History
 * API, which Next.js keeps in sync with useSearchParams), so the back button,
 * reloads and shared links all behave naturally.
 */
export function Planner({ moods, catalog }: { moods: Mood[]; catalog: Catalog }) {
  const params = useSearchParams();
  const input = useMemo(() => decodeInput(params), [params]);
  const rawStep = Number(params.get("step") ?? "1");
  const step = rawStep === 2 || rawStep === 3 ? rawStep : 1;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStep = useRef(step);

  const go = (next: PlannerInput, nextStep: number, mode: "push" | "replace" = "push") => {
    const q = encodeInput(next);
    const url = `/plan?${q}${q ? "&" : ""}step=${nextStep}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };

  useEffect(() => {
    track("planner_step_view", { step });
    if (prevStep.current === step) return;
    prevStep.current = step;
    // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [step]);

  const escapes = useMemo(() => (step === 3 ? recommend(input, catalog) : []), [step, input, catalog]);

  useEffect(() => {
    if (step === 3) track("escapes_revealed", { count: escapes.length, moods: input.moods.length, from_known: Boolean(escapes[0]?.flight) });
  }, [step, escapes, input.moods.length]);

  return (
    <div className="planner-step">
      <StepNav current={step} />

      {step === 1 ? (
        <section aria-labelledby="step-title">
          <div className="step-intro">
            <h1 id="step-title" ref={headingRef} tabIndex={-1}>
              How do you want to feel?
            </h1>
            <p className="lede">Choose one feeling or several. We will look for places where they meet.</p>
          </div>
          <MoodPicker moods={moods} selected={input.moods} onChange={(m) => go({ ...input, moods: m }, 1, "replace")} legend="How do you want to feel?" large />
          <div className="step-actions">
            <button type="button" className="text-button" onClick={() => go({ ...input, moods: [] }, 2)}>
              Not sure yet? Continue without choosing
            </button>
            <button type="button" className="btn" disabled={!input.moods.length} onClick={() => go(input, 2)}>
              Continue <Arrow />
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section aria-labelledby="step-title">
          <div className="step-intro">
            <h1 id="step-title" ref={headingRef} tabIndex={-1}>
              Set the boundaries
            </h1>
            <p className="lede">Every answer is optional. The more you share, the more precisely we can shape each escape.</p>
          </div>
          <Boundaries input={input} airports={catalog.airports} onChange={(next) => go(next, 2, "replace")} />
          <div className="step-actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(input, 1)}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="btn" onClick={() => go(input, 3)}>
              Reveal my escapes <Arrow />
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section aria-labelledby="step-title">
          <div className="step-intro">
            <h1 id="step-title" ref={headingRef} tabIndex={-1}>
              Three escapes
            </h1>
            <p className="lede">
              Three different journeys shaped by your answers. Each explains why it fits and what is worth knowing. Open one to see the complete
              escape.
            </p>
          </div>
          <p className="sr-only" role="status">
            {escapes.length ? `${escapes.length} escapes revealed.` : "No escapes matched."}
          </p>
          {escapes.length ? (
            <ol className="escapes">
              {escapes.map((e, i) => (
                <li key={e.destination.id}>
                  <EscapeCard escape={e} index={i} query={encodeInput(input)} />
                </li>
              ))}
            </ol>
          ) : (
            <div className="state">
              <h2>We could not compose an escape</h2>
              <p className="muted">Something went wrong loading our destinations. Please try again, or start over with different answers.</p>
              <button type="button" className="btn btn--ghost" onClick={() => go({ moods: [] }, 1)}>
                Start again
              </button>
            </div>
          )}
          <div className="step-actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(input, 2)}>
              <span aria-hidden="true">←</span> Change my answers
            </button>
            <div className="step-actions__right">
              <button type="button" className="text-button" onClick={() => go({ moods: [] }, 1)}>
                Start again
              </button>
              <Link href="/destinations" className="link-arrow">
                Browse all destinations <Arrow />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
