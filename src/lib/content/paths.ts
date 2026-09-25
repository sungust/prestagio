import type { ArticleMeta } from "@/lib/types";

/** Canonical URL of an article: destination stories live under their place. */
export function articlePath(a: Pick<ArticleMeta, "section" | "slug" | "destinations">): string {
  if (a.section === "destinations") return `/destinations/${a.destinations[0]}/${a.slug}`;
  return `/${a.section}/${a.slug}`;
}
