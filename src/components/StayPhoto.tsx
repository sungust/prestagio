import Image from "next/image";
import type { ImageRef } from "@/lib/types";
import { getAffiliate, isLive } from "@/lib/content/affiliates";
import { AffiliateLink } from "./AffiliateLink";
import { Media } from "./Media";

/**
 * The recommended property's own photo, supplied by Agoda Partners and shown
 * linked to its Agoda page (with Prestagio's partner ID), as Agoda's image-link
 * terms require. Falls back to the destination photo when there is no live link.
 */
export function StayPhoto({
  affiliateId,
  stayName,
  context,
  fallback,
  className = "",
  sizes = "(max-width: 760px) 100vw, 50vw",
}: {
  affiliateId?: string;
  stayName: string;
  context: string;
  fallback: ImageRef;
  className?: string;
  sizes?: string;
}) {
  const a = affiliateId ? getAffiliate(affiliateId) : undefined;
  if (!isLive(a) || !a.image) return <Media image={fallback} className={className} decorative sizes={sizes} />;
  return (
    <AffiliateLink id={a.id} context={`${context}:photo`} className={`media stay-photo ${className}`}>
      <Image src={a.image} alt={`${stayName}, as pictured on Agoda`} fill sizes={sizes} style={{ objectFit: "cover" }} />
      <span className="stay-photo__credit" aria-hidden="true">
        Image: Agoda
      </span>
    </AffiliateLink>
  );
}
