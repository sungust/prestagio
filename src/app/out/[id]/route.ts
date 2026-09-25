import type { NextRequest } from "next/server";
import { getAffiliate, isLive } from "@/lib/content/affiliates";

/**
 * Outbound affiliate redirect. Sends visitors to the approved Agoda deep link
 * (which carries Prestagio's partner ID), or back to the editorial page when
 * the link is not live. robots.txt keeps /out/ out of search indexes.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const affiliate = getAffiliate(id);
  const fallback = new URL(affiliate?.fallbackPath ?? "/hotels", req.url).toString();
  const target = isLive(affiliate) ? affiliate.url : fallback;
  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
