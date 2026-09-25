import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";

export const metadata: Metadata = { title: "Affiliate Disclosure", description: "How Prestagio uses affiliate links, including Agoda.", alternates: { canonical: "/disclosure" } };

export default function DisclosurePage() {
  return (
    <ProsePage title="Affiliate disclosure" lede="Plain answers about how Prestagio is funded and how that does, and does not, affect what you read.">
      <h2>Affiliate links</h2>
      <p>
        Some links on Prestagio, such as “See this stay on Agoda”, are affiliate links. If you follow one and make a booking, Prestagio may
        receive a commission from the partner. You pay the same price. Affiliate links are marked where they appear, alongside a short
        disclosure.
      </p>
      <h2>Which partners</h2>
      <p>
        Prestagio intends to work with the Agoda Partners programme for hotel and resort bookings. We only show a booking link once the
        programme has approved it, and we follow the programme&apos;s terms.
      </p>
      <h2>What partners do not do</h2>
      <ul>
        <li>Partners do not choose, review or approve our stories or recommendations.</li>
        <li>Every recommendation is useful without a link, and many stays we feature have none.</li>
        <li>We do not copy partner inventory, prices, photographs or reviews onto Prestagio.</li>
      </ul>
      <h2>Bookings and rates</h2>
      <p>
        Prestagio does not take bookings and cannot guarantee rates or availability. Prices, availability and booking terms are set by the
        provider you book with. Any questions about a booking should go to that provider.
      </p>
      <h2>Measuring clicks</h2>
      <p>
        We count clicks on affiliate links anonymously, without cookies or personal identifiers, to understand which recommendations readers find
        useful. See our <Link href="/privacy">privacy notice</Link>.
      </p>
    </ProsePage>
  );
}
