import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";

export const metadata: Metadata = { title: "About", description: "Prestagio is a luxury travel and lifestyle publication.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <ProsePage title="About Prestagio" lede="A luxury travel and lifestyle publication about where you stay, how you arrive, and everything you take with you.">
      <p>
        Prestagio began with a simple idea. The most memorable journeys are made of many parts that belong together: the place, the stay, the
        arrival, the road, the watch on your wrist and the scent of the room at the end of the day.
      </p>
      <p>
        We write about those parts in five collections: <Link href="/destinations">Destinations</Link>, <Link href="/hotels">Stays</Link>,{" "}
        <Link href="/cars">Cars</Link>, <Link href="/watches">Watches</Link> and <Link href="/aroma">Aroma</Link>. The{" "}
        <Link href="/plan">Planner</Link> brings them together into complete escapes, shaped around how you want to feel.
      </p>
      <h2>How we work</h2>
      <p>
        Our stories are researched from official and published sources, and we say clearly when a story is based on research rather than a
        visit. We do not publish invented reviews, prices, availability, ratings or quotations. Read our{" "}
        <Link href="/editorial-standards">editorial standards</Link>.
      </p>
      <h2>How we are funded</h2>
      <p>
        Some links to stays may be affiliate links. If you book through them, we may earn a commission at no extra cost to you. Partners never
        decide what we write or recommend. See our <Link href="/disclosure">affiliate disclosure</Link>.
      </p>
      <p>
        Prestagio does not take bookings, sell travel or guarantee rates. <Link href="/contact">Get in touch</Link>.
      </p>
    </ProsePage>
  );
}
