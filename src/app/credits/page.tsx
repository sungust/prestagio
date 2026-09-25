import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { creditFor } from "@/components/Media";
import { allArticlesUnfiltered } from "@/lib/content/articles";
import { articlePath } from "@/lib/content/paths";
import { isVisible } from "@/lib/content/stage";

export const metadata: Metadata = { title: "Image Credits", alternates: { canonical: "/credits" } };

export default function CreditsPage() {
  const articles = allArticlesUnfiltered().filter((a) => isVisible(a.status));
  return (
    <ProsePage title="Image credits" lede="Every image on Prestagio, and where it comes from.">
      <p>
        Images marked &ldquo;Image: Prestagio&rdquo; are Prestagio&rsquo;s own design artwork. They are atmospheric, not literal: they do not depict any
        specific hotel, car, watch or view. Where no photograph is in place yet, Prestagio uses original illustrations created for the site.
      </p>
      <ul>
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={articlePath(a)}>{a.title}</Link>: {creditFor(a.hero)}
            {a.hero.license ? ` (${a.hero.license})` : ""}
          </li>
        ))}
      </ul>
    </ProsePage>
  );
}
