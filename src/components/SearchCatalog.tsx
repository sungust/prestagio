"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/types";
import { articlePath } from "@/lib/content/paths";

type Entry = { kind: "story" | "place"; title: string; text: string; href: string; tags: string; label: string };

export function SearchCatalog({ articles, places, initial = "" }: { articles: ArticleMeta[]; places: { id: string; name: string; country: string; tagline: string }[]; initial?: string }) {
  const [q, setQ] = useState(initial);
  const entries: Entry[] = useMemo(
    () => [
      ...places.map((p) => ({ kind: "place" as const, title: p.name, text: p.tagline, href: `/destinations/${p.id}`, tags: p.country, label: `Destination · ${p.country}` })),
      ...articles.map((a) => ({ kind: "story" as const, title: a.title, text: a.deck, href: articlePath(a), tags: [...a.tags, ...a.destinations, a.section].join(" "), label: a.section })),
    ],
    [articles, places],
  );
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length ? entries.filter((e) => terms.every((t) => `${e.title} ${e.text} ${e.tags}`.toLowerCase().includes(t))) : entries;

  return (
    <div>
      <form role="search" className="search-bar" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="sr-only">
          Search stories and destinations
        </label>
        <input id="q" className="input" type="search" placeholder="Search places, stays, cars, watches…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      </form>
      <p className="hint" role="status">
        {results.length} {results.length === 1 ? "result" : "results"}
        {q ? ` for “${q}”` : ""}
      </p>
      {results.length ? (
        <ul className="saved-list" style={{ marginTop: 12 }}>
          {results.map((r) => (
            <li key={r.href} style={{ display: "block" }}>
              <span className="kicker">{r.label}</span>
              <h2 style={{ fontSize: 26, margin: "4px 0" }}>
                <Link href={r.href}>{r.title}</Link>
              </h2>
              <p style={{ margin: 0 }} className="muted">
                {r.text}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="state" style={{ marginTop: 20 }}>
          <h2>Nothing found</h2>
          <p className="muted">
            Try a place or a category, or let the <Link href="/plan">Planner</Link> suggest somewhere.
          </p>
        </div>
      )}
    </div>
  );
}
