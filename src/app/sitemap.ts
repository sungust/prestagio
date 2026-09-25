import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content/articles";
import { articlePath } from "@/lib/content/paths";
import { contentStage } from "@/lib/content/stage";
import { loadPlannerData } from "@/lib/planner/data";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/plan", "/destinations", "/hotels", "/cars", "/watches", "/aroma", "/about", "/contact", "/privacy", "/disclosure", "/editorial-standards"];
  const places = loadPlannerData().destinations.map((d) => `/destinations/${d.id}`);
  // Only published stories belong in the sitemap, even on previews.
  const articles = contentStage() === "production" ? getArticles() : getArticles().filter((a) => a.status === "published");
  return [
    ...[...staticPaths, ...places].map((p) => ({ url: absoluteUrl(p) })),
    ...articles.map((a) => ({ url: absoluteUrl(articlePath(a)), lastModified: a.updated ?? a.published })),
  ];
}
