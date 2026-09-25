import fs from "node:fs";
import path from "node:path";
import type { Affiliate } from "@/lib/types";

const FILE = path.join(process.cwd(), "content", "affiliates.json");

export function getAffiliates(): Affiliate[] {
  return (JSON.parse(fs.readFileSync(FILE, "utf8")) as { affiliates: Affiliate[] }).affiliates;
}

export function getAffiliate(id: string): Affiliate | undefined {
  return getAffiliates().find((a) => a.id === id);
}

const ALLOWED_HOSTS = ["agoda.com", "www.agoda.com"];

/** A link is live only when approved AND pointing at an allowed programme host. */
export function isLive(a: Affiliate | undefined): a is Affiliate {
  if (!a || !a.approved || !a.url) return false;
  try {
    const u = new URL(a.url);
    return u.protocol === "https:" && ALLOWED_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}
