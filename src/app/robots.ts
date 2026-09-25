import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { contentStage } from "@/lib/content/stage";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  if (contentStage() !== "production") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/out/", "/api/", "/admin/", "/search"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
