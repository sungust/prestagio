import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";

export const metadata: Metadata = { title: "Editorial Standards", description: "How Prestagio researches, writes, reviews and corrects its stories.", alternates: { canonical: "/editorial-standards" } };

export default function StandardsPage() {
  return (
    <ProsePage title="Editorial standards" lede="What you can expect from every Prestagio story, escape and recommendation.">
      <h2>Research and first-hand reporting</h2>
      <p>
        Each story states whether it is based on research or on a first-hand visit. Research-based stories list their sources. We never describe
        a visit, meal or stay that did not happen.
      </p>
      <h2>What we will not publish</h2>
      <ul>
        <li>Invented reviews, ratings, awards, endorsements or quotations.</li>
        <li>Prices, fares, availability, opening hours or routes presented as live when they are not.</li>
        <li>Images that suggest they show a specific property, car or place when they do not.</li>
        <li>An attraction or historic building presented as somewhere you can stay.</li>
      </ul>
      <h2>The Planner</h2>
      <p>
        The Planner recommends escapes using a curated dataset and transparent rules that our editors maintain. Its explanations reflect exactly
        why each escape was chosen. Flying times are clearly labelled estimates based on distance. We do not show fares.
      </p>
      <h2>Review and publication</h2>
      <p>
        Every story moves from draft to editorial review to publication, and only an editor can publish. Drafts produced with software assistance
        are always reviewed and fact-checked by a person before publication.
      </p>
      <h2>Images</h2>
      <p>
        Every image carries its credit and licence. Where we do not yet have licensed photography, we use clearly labelled original illustrations.
        See <Link href="/credits">image credits</Link>.
      </p>
      <h2>Corrections</h2>
      <p>
        If you believe something is wrong or out of date, please <Link href="/contact?topic=correction">tell us</Link>. We correct factual errors
        promptly, update the story&apos;s date, and note significant corrections on the story.
      </p>
    </ProsePage>
  );
}
