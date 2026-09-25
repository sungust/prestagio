import Link from "next/link";
import { getAffiliate, isLive } from "@/lib/content/affiliates";
import { AffiliateLink } from "./AffiliateLink";

/**
 * A stay-booking module. It renders a commercial link only when an approved
 * Agoda URL has been configured, and always carries a disclosure next to it.
 * Without an approved link the editorial recommendation stands on its own.
 */
export function AffiliateModule({ id, stayName, context }: { id?: string; stayName: string; context: string }) {
  const affiliate = id ? getAffiliate(id) : undefined;
  if (!isLive(affiliate)) return null;
  return (
    <div className="affiliate">
      <span className="kicker">Check availability</span>
      <div>
        <AffiliateLink id={affiliate.id} context={context} className="btn btn--sm">
          See {stayName} on Agoda
        </AffiliateLink>
      </div>
      <p className="affiliate__disclosure">
        Affiliate link: Prestagio may earn a commission if you book, at no extra cost to you. Rates and availability are set by the provider;
        Prestagio does not take bookings. <Link href="/disclosure">Learn more</Link>.
      </p>
    </div>
  );
}
