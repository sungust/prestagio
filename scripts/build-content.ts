/**
 * Compiles /content (Markdown articles, Planner JSON, affiliate links) into
 * src/generated/content.json, which the site imports at build time.
 * Runs automatically before dev, build and tests. Run: npm run content:build
 */
import fs from "node:fs";
import path from "node:path";
import { compileContent } from "../src/lib/content/source";

const out = path.join(process.cwd(), "src", "generated", "content.json");
const content = compileContent();
fs.mkdirSync(path.dirname(out), { recursive: true });
const json = JSON.stringify(content);
if (!fs.existsSync(out) || fs.readFileSync(out, "utf8") !== json) fs.writeFileSync(out, json);
console.log(`✓ Compiled ${content.articles.length} articles, ${content.planner.destinations.length} destinations, ${content.affiliates.length} affiliate links`);
