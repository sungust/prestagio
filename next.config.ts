import type { NextConfig } from "next";

/**
 * Deployment stage, fixed at build time so it is identical in static pages and
 * server functions on any host: Vercel (VERCEL_ENV), Netlify (CONTEXT) or
 * Cloudflare Workers Builds (WORKERS_CI, treated as production unless
 * CONTENT_STAGE=preview). An explicit CONTENT_STAGE always wins.
 */
const onCloudflare = process.env.WORKERS_CI === "1" || process.env.PRESTAGIO_TARGET === "cloudflare";
const deployStage =
  process.env.CONTENT_STAGE ||
  (process.env.VERCEL_ENV === "production" || process.env.CONTEXT === "production" || process.env.WORKERS_CI === "1"
    ? "production"
    : "preview");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { DEPLOY_STAGE: deployStage },
  images: {
    // Cloudflare: serve licensed photos as uploaded (pre-optimise them), so no
    // paid Cloudflare Images binding is required.
    unoptimized: onCloudflare,
    formats: ["image/avif", "image/webp"],
    // Add licensed photo hosts here when real photography is supplied.
    remotePatterns: [],
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
