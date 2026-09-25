import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "How Prestagio handles your data.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy" lede="We collect as little as possible, and nothing we don't need.">
      <p className="hint">
        This summary describes how the site is built. It should be reviewed by Prestagio&apos;s legal adviser and completed with the operator&apos;s
        legal name, address and jurisdiction before launch.
      </p>
      <h2>Planner answers</h2>
      <p>
        Your Planner answers stay in the page address (the link) and in your browser. We do not store them on our servers. Escapes you save are
        kept in your browser&apos;s local storage, and you can remove them at any time.
      </p>
      <h2>Analytics</h2>
      <p>
        We measure how the site is used with privacy-conscious analytics: no cookies, no advertising identifiers, and no personal data. We record
        events such as “Planner step viewed” or “escape saved” without your answers, email address or any free text. If your browser sends a
        Global Privacy Control or Do Not Track signal, we record nothing.
      </p>
      <h2>Email</h2>
      <p>
        If you ask us to email an escape, we use your address only to send that one message through our email provider. Marketing email is
        separate: we only add you to the newsletter if you tick the optional box, and you can unsubscribe at any time.
      </p>
      <h2>Contact form</h2>
      <p>Messages you send through the contact form are delivered to our editors by email and used only to reply to you.</p>
      <h2>Affiliate links</h2>
      <p>
        When you follow an affiliate link, you leave Prestagio for the partner&apos;s site, and their privacy policy applies there. See our{" "}
        <Link href="/disclosure">affiliate disclosure</Link>.
      </p>
      <h2>Your rights</h2>
      <p>
        To ask about, correct or delete any data we hold about you, email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </ProsePage>
  );
}
