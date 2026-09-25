"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/** Outbound affiliate links go through /out/[id] so URLs stay configurable. */
export function AffiliateLink({ id, context, className, children }: { id: string; context: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`/out/${id}`}
      className={className}
      rel="sponsored nofollow noopener"
      target="_blank"
      onClick={() => track("affiliate_click", { id, context })}
    >
      {children}
      <span className="sr-only"> (opens Agoda in a new tab)</span>
    </a>
  );
}
