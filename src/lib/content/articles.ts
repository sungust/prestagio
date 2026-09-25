import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Article, ArticleMeta, Section } from "@/lib/types";
import { isVisible } from "./stage";

const DIR = path.join(process.cwd(), "content", "articles");

function toIsoDate(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

function parse(file: string): Article {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
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

let cache: Article[] | null = null;

/** Every article on disk regardless of status (for validation and the CMS import). */
export function allArticlesUnfiltered(): Article[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published));
  return cache;
}

export function getArticles(filter: { section?: Section; destination?: string } = {}): Article[] {
  return allArticlesUnfiltered().filter(
    (a) =>
      isVisible(a.status) &&
      (!filter.section || a.section === filter.section) &&
      (!filter.destination || a.destinations.includes(filter.destination)),
  );
}

export function getArticle(slug: string): Article | undefined {
  const a = allArticlesUnfiltered().find((x) => x.slug === slug);
  return a && isVisible(a.status) ? a : undefined;
}

export function articlesBySlugs(slugs: string[]): Article[] {
  return slugs.map(getArticle).filter((a): a is Article => Boolean(a));
}

export { articlePath } from "./paths";

export function toMeta(a: Article): ArticleMeta {
  const { html: _html, ...meta } = a;
  return meta;
}
