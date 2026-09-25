"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Records one anonymous event when a reader reaches 75% of an article. */
export function ArticleEngagement({ slug }: { slug: string }) {
  useEffect(() => {
    const target = document.getElementById("article-end");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("article_engaged", { slug });
        io.disconnect();
      }
    });
    io.observe(target);
    return () => io.disconnect();
  }, [slug]);
  return null;
}
