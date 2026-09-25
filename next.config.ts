import type { NextConfig } from "next";

/**
 * Deployment stage, fixed at build time so it is identical in static pages and
 * server functions on any host: Vercel (VERCEL_ENV), Netlify (CONTEXT) or
 * Cloudflare Workers Builds (WORKERS_CI). On Cloudflare only the production
 * branches build as production; every other branch builds a preview that shows
 * stories in review and is noindex. An explicit CONTENT_STAGE always wins.
 */
const PRODUCTION_BRANCHES = ["claude/amazing-darwin-salc5c", "main"];
const onCloudflare = process.env.WORKERS_CI === "1" || process.env.PRESTAGIO_TARGET === "cloudflare";
const cloudflareProduction =
  process.env.WORKERS_CI === "1" && (!process.env.WORKERS_CI_BRANCH || PRODUCTION_BRANCHES.includes(process.env.WORKERS_CI_BRANCH));
const deployStage =
  process.env.CONTENT_STAGE ||
  (process.env.VERCEL_ENV === "production" || process.env.CONTEXT === "production" || cloudflareProduction ? "production" : "preview");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { DEPLOY_STAGE: deployStage },
  images: {
    // Cloudflare: serve licensed photos as uploaded (pre-optimise them), so no
    // paid Cloudflare Images binding is required.
    unoptimized: onCloudflare,
    formats: ["image/avif", "image/webp"],
    // Hotel photos from the Agoda Partners image-link tool, always shown linked to Agoda.
    remotePatterns: [{ protocol: "https", hostname: "pix8.agoda.net" }],
  },
  async redirects() {
    return [
      // "Stays" is the navigation label; /hotels remains the canonical URL.
      { source: "/stays", destination: "/hotels", permanent: true },
      { source: "/stays/:slug*", destination: "/hotels/:slug*", permanent: true },
      { source: "/hotel", destination: "/hotels", permanent: true },
      { source: "/car", destination: "/cars", permanent: true },
      { source: "/watch", destination: "/watches", permanent: true },
      { source: "/aromas", destination: "/aroma", permanent: true },
      { source: "/plan-an-escape", destination: "/plan", permanent: true },
      { source: "/design-my-escape", destination: "/plan", permanent: true },
      { source: "/calculator", destination: "/plan", permanent: true },
      { source: "/affiliate-disclosure", destination: "/disclosure", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
