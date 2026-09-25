/**
 * Import articles exported from the internal studio (internal.prestagio.com).
 *
 *   npm run import:studio -- path/to/export.json [--dry-run]
 *
 * The export format is documented in docs/CONTENT-OPERATIONS.md. Every
 * imported article is written with status "draft", whatever the export says,
 * so an editor must review it (and move it to "review", then "published")
 * before it can appear anywhere. Existing files are never overwritten.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

interface StudioArticle {
  slug: string;
  title: string;
  deck: string;
  section: "destinations" | "hotels" | "cars" | "watches" | "aroma";
  destinations?: string[];
  tags?: string[];
  author?: string;
  body: string;
  sources?: { title: string; url: string; publisher?: string }[];
  hero?: { src?: string; alt: string; credit?: string; license?: string; sourceUrl?: string };
  linkLabel?: string;
  aiAssisted?: boolean;
}

const SECTIONS = new Set(["destinations", "hotels", "cars", "watches", "aroma"]);
const DIR = path.join(process.cwd(), "content", "articles");

function validate(a: StudioArticle): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9-]{3,100}$/.test(a.slug ?? "")) errors.push("slug must be kebab-case");
  if (!a.title) errors.push("title is required");
  if (!a.deck) errors.push("deck is required");
  if (!SECTIONS.has(a.section)) errors.push(`section must be one of ${[...SECTIONS].join(", ")}`);
  if (a.section === "destinations" && !a.destinations?.length) errors.push("destination stories need at least one destination");
  if (!a.body || a.body.length < 200) errors.push("body is missing or too short");
  if (a.hero?.src && !a.hero.credit) errors.push("hero photo needs a credit");
  if (a.hero && !a.hero.alt) errors.push("hero image needs alt text");
  if (/explore the journal/i.test(a.linkLabel ?? "")) errors.push("use a specific link label, not 'Explore the Journal'");
  return errors;
}

function main() {
  const [file, flag] = process.argv.slice(2);
  if (!file) {
    console.error("Usage: npm run import:studio -- export.json [--dry-run]");
    process.exit(1);
  }
  const dry = flag === "--dry-run";
  const items = JSON.parse(fs.readFileSync(file, "utf8")) as StudioArticle[] | { articles: StudioArticle[] };
  const list = Array.isArray(items) ? items : items.articles;
  let ok = 0;
  for (const a of list) {
    const errors = validate(a);
    const target = path.join(DIR, `${a.slug}.md`);
    if (fs.existsSync(target)) errors.push("an article with this slug already exists (not overwritten)");
    if (errors.length) {
      console.warn(`✗ ${a.slug ?? "(no slug)"}: ${errors.join("; ")}`);
      continue;
    }
    const today = new Date().toISOString().slice(0, 10);
    const frontmatter = {
      title: a.title,
      deck: a.deck,
      section: a.section,
      destinations: a.destinations ?? [],
      tags: a.tags ?? [],
      author: a.author ?? "Prestagio Editors",
      published: today,
      status: "draft",
      basis: "research",
      linkLabel: a.linkLabel ?? "Read the story",
      hero: { scene: "coast", ...(a.hero ?? { alt: a.title }) },
      sources: a.sources ?? [],
      related: [],
      affiliates: [],
      ...(a.aiAssisted ? { importNote: "AI-assisted draft from the internal studio: fact-check every claim before review." } : {}),
    };
    if (!dry) fs.writeFileSync(target, matter.stringify(a.body.trim() + "\n", frontmatter));
    console.log(`✓ ${a.slug} → content/articles/${a.slug}.md (status: draft)${dry ? " [dry run]" : ""}`);
    ok++;
  }
  console.log(`${ok}/${list.length} imported as drafts.`);
}

main();
