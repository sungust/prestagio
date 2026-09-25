import type { Article, ArticleMeta, Section } from "@/lib/types";
import { CONTENT } from "./compiled";
import { isVisible } from "./stage";

/** Every article regardless of status (for validation and credits). */
export function allArticlesUnfiltered(): Article[] {
  return CONTENT.articles;
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
