import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/out/", "/api/", "/admin/", "/search"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
