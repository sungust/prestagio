/**
 * Privacy-conscious analytics.
 *
 * - No cookies, no local identifiers, no personal data (never emails or free text).
 * - Sent with sendBeacon to a Plausible-compatible endpoint when configured.
 * - Respects Global Privacy Control and Do Not Track.
 */
export type EventName =
  | "hero_cta_click"
  | "plan_cta_click"
  | "planner_step_view"
  | "planner_mood_toggle"
  | "escapes_revealed"
  | "escape_opened"
  | "escape_saved"
  | "escape_shared"
  | "escape_email_requested"
  | "article_engaged"
  | "affiliate_click";

type Props = Record<string, string | number | boolean>;

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
const DOMAIN = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || "prestagio.com";

function optedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

export function track(name: EventName, props: Props = {}) {
  if (typeof window === "undefined" || optedOut()) return;
  if (!ENDPOINT) {
    if (process.env.NODE_ENV === "development") console.debug("[analytics]", name, props);
    return;
  }
  const body = JSON.stringify({
    name,
    domain: DOMAIN,
    // Path only: query strings can contain planner answers, which we do not collect.
    url: `${location.origin}${location.pathname}`,
    props,
  });
  try {
    if (!navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain" }))) {
      void fetch(ENDPOINT, { method: "POST", body, keepalive: true });
    }
  } catch {
    /* analytics must never break the page */
  }
}
