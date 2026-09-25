import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Prestagio: Go Somewhere Extraordinary", template: "%s · Prestagio" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Prestagio", locale: "en_GB", url: SITE.url },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Prestagio",
            url: SITE.url,
            logo: `${SITE.url}/favicon.svg`,
          }}
        />
      </body>
    </html>
  );
}
