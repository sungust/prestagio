"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readSaved, writeSaved, type SavedEscape } from "./saved";

export function SavedEscapes() {
  const [list, setList] = useState<SavedEscape[]>([]);
  useEffect(() => {
    const sync = () => setList(readSaved());
    sync();
    window.addEventListener("prestagio:saved", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("prestagio:saved", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <section id="saved" aria-labelledby="saved-title" style={{ marginTop: 72, scrollMarginTop: 100 }}>
      <h2 id="saved-title" style={{ fontSize: 32, marginBottom: 8 }}>
        Your saved escapes
      </h2>
      {list.length ? (
        <ul className="saved-list">
          {list.map((s) => (
            <li key={s.url}>
              <Link href={s.url}>{s.name}</Link>
              <button type="button" className="text-button muted" onClick={() => writeSaved(readSaved().filter((x) => x.url !== s.url))}>
                Remove<span className="sr-only"> {s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Escapes you save appear here. They are stored only in this browser.</p>
      )}
    </section>
  );
}
