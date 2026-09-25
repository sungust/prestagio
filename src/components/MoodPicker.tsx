"use client";

import type { Mood, MoodId } from "@/lib/planner/types";
import { track } from "@/lib/analytics";
import { Scene } from "./Scene";
import { CheckIcon } from "./Icons";

export function MoodPicker({
  moods,
  selected,
  onChange,
  legend,
  large = false,
}: {
  moods: Mood[];
  selected: MoodId[];
  onChange: (next: MoodId[]) => void;
  legend: string;
  large?: boolean;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend} (choose as many as you like)</legend>
      <div className={`moods ${large ? "moods--large" : ""}`}>
        {moods.map((m) => {
          const checked = selected.includes(m.id);
          return (
            <label key={m.id} className="mood">
              <input
                type="checkbox"
                name="mood"
                value={m.id}
                checked={checked}
                onChange={() => {
                  const next = checked ? selected.filter((x) => x !== m.id) : [...selected, m.id];
                  track("planner_mood_toggle", { mood: m.id, on: !checked });
                  onChange(next);
                }}
              />
              <span className="media">
                <Scene kind={m.image.scene} tone={m.image.tone} seed={m.id} />
              </span>
              <span className="mood__check" aria-hidden="true">
                <CheckIcon />
              </span>
              <span className="mood__label">{m.label}</span>
              {large ? <span className="mood__line">{m.line}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
