import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
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
