import Link from "next/link";
import type { ArticleMeta } from "@/lib/types";
import { SECTIONS } from "@/lib/site";
import { articlePath } from "@/lib/content/paths";
import { Media } from "./Media";
import { Arrow } from "./Icons";

export function ReviewBadge({ status }: { status: ArticleMeta["status"] }) {
  if (status !== "review") return null;
  return <span className="badge-review">In editorial review</span>;
}

export function StoryCard({ article, variant = "default", headingLevel = 3 }: { article: ArticleMeta; variant?: "feature" | "default"; headingLevel?: 2 | 3 }) {
  const href = articlePath(article);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`story ${variant === "feature" ? "story--feature" : ""}`}>
      <Media
        image={article.hero}
        className="story__media"
        decorative
        sizes={variant === "feature" ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 900px) 100vw, 45vw"}
      />
      <div className="story__body">
        <div className="card__meta">
          <span className="kicker">{SECTIONS[article.section].label}</span>
          <ReviewBadge status={article.status} />
        </div>
        <H>
          <Link href={href}>{article.title}</Link>
        </H>
        <p>{article.deck}</p>
        <span className="link-arrow" aria-hidden="true">
          {article.linkLabel} <Arrow />
        </span>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="card">
      <Media image={article.hero} className="card__media" decorative sizes="(max-width: 700px) 100vw, 33vw" />
      <div className="card__meta">
        <span className="kicker">{SECTIONS[article.section].label}</span>
        <span className="kicker">{article.readingMinutes} min read</span>
        <ReviewBadge status={article.status} />
      </div>
      <h3>
        <Link href={articlePath(article)}>{article.title}</Link>
      </h3>
      <p>{article.deck}</p>
      <span className="link-arrow" aria-hidden="true">
        {article.linkLabel} <Arrow />
      </span>
    </article>
  );
}

export function EmptyStories({ children }: { children?: React.ReactNode }) {
  return (
    <div className="state">
      <h2>New stories are on their way</h2>
      <p className="muted">{children ?? "Our editors are preparing the first stories for this section."}</p>
    </div>
  );
}
