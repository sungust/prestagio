import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Contact the Prestagio editors.", alternates: { canonical: "/contact" } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const topic = typeof sp.topic === "string" ? sp.topic : "general";
  const page = typeof sp.page === "string" ? sp.page.slice(0, 300) : "";
  return (
    <ProsePage title="Contact" lede="Questions, corrections, partnerships or press: we read everything.">
      <p>
        Write to <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>, or use the form below. Prestagio does not take bookings, so please
        contact your hotel or booking provider about reservations.
      </p>
      <ContactForm topic={topic} page={page} />
    </ProsePage>
  );
}
