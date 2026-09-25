"use client";

import type { Mood, MoodId } from "@/lib/planner/types";
import { track } from "@/lib/analytics";
import { Artwork } from "./Media";
import { resolveImage } from "@/lib/photos";
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
                <Artwork image={resolveImage(m.image)} seed={m.id} sizes="(max-width: 760px) 50vw, 15vw" />
              </span>
              <span className="mood__check" aria-hidden="true">
                <CheckIcon />
              </span>
              <span className="mood__text">
                <span className="mood__label">{m.label}</span>
                {large ? <span className="mood__line">{m.line}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
