import type { ContentStatus } from "@/lib/types";

/**
 * Publication gate.
 *
 * - production: only `published` content is visible.
 * - preview (local, Vercel preview deployments): `published` and `review`
 *   content is visible, and review items carry a visible "In editorial review" label.
 * `draft` content is never rendered anywhere, so nothing publishes itself.
 */
export function contentStage(): "production" | "preview" {
  if (process.env.CONTENT_STAGE === "production") return "production";
  if (process.env.CONTENT_STAGE === "preview") return "preview";
  return process.env.VERCEL_ENV === "production" ? "production" : "preview";
}

export function isVisible(status: ContentStatus): boolean {
  if (status === "published") return true;
  return status === "review" && contentStage() === "preview";
}
