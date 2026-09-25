/**
 * Build-time content readers. These use the filesystem and run only in Node
 * (the content build script, tests and validation), never at request time,
 * so the site runs on hosts without a filesystem such as Cloudflare Workers.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Affiliate, Article } from "@/lib/types";
import type { PlannerData } from "@/lib/planner/data";
import type { Airport, Aroma, Car, Destination, Mood, Watch } from "@/lib/planner/types";

const CONTENT = path.join(process.cwd(), "content");

function toIsoDate(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

function parseArticle(file: string): Article {
  const raw = fs.readFileSync(path.join(CONTENT, "articles", file), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    deck: data.deck,
    section: data.section,
    destinations: data.destinations ?? [],
    tags: data.tags ?? [],
    author: data.author ?? "Prestagio Editors",
    editor: data.editor,
    published: toIsoDate(data.published)!,
    updated: toIsoDate(data.updated),
    status: data.status ?? "draft",
    basis: data.basis ?? "research",
    hero: data.hero,
    sources: data.sources ?? [],
    related: data.related ?? [],
    affiliates: data.affiliates ?? [],
    featured: Boolean(data.featured),
    linkLabel: data.linkLabel ?? "Read the story",
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    readingMinutes: Math.max(2, Math.round(words / 230)),
    html: marked.parse(content, { async: false }) as string,
  };
}

export function readArticles(): Article[] {
  return fs
    .readdirSync(path.join(CONTENT, "articles"))
    .filter((f) => f.endsWith(".md"))
    .map(parseArticle)
    .sort((a, b) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published) || a.slug.localeCompare(b.slug));
}

function readJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, rel), "utf8")) as T;
}

export function readPlanner(): PlannerData {
  const destinations = fs
    .readdirSync(path.join(CONTENT, "planner", "destinations"))
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => readJson<Destination>(path.join("planner", "destinations", f)));
  return {
    moods: readJson<{ moods: Mood[] }>("planner/moods.json").moods,
    airports: readJson<{ airports: Airport[] }>("planner/airports.json").airports,
    cars: readJson<{ cars: Car[] }>("planner/cars.json").cars,
    watches: readJson<{ watches: Watch[] }>("planner/watches.json").watches,
    aromas: readJson<{ aromas: Aroma[] }>("planner/aromas.json").aromas,
    destinations,
  };
}

export function readAffiliates(): Affiliate[] {
  return readJson<{ affiliates: Affiliate[] }>("affiliates.json").affiliates;
}

export interface CompiledContent {
  articles: Article[];
  planner: PlannerData;
  affiliates: Affiliate[];
}

export function compileContent(): CompiledContent {
  return { articles: readArticles(), planner: readPlanner(), affiliates: readAffiliates() };
}
