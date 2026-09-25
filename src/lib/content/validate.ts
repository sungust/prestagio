import fs from "node:fs";
import path from "node:path";
import { allArticlesUnfiltered } from "./articles";
import { getAffiliates } from "./affiliates";
import { loadPlannerData } from "@/lib/planner/data";
import { MOOD_IDS, PARTIES } from "@/lib/planner/types";

/** Names that must never be presented as somewhere to stay. */
const ATTRACTIONS = [/casa del fascio/i, /villa del balbianello/i, /villa carlotta/i, /villa rufolo/i, /villa cimbrone/i, /kinkaku/i, /jer[oó]nimos/i];

export function contentErrors(): string[] {
  const errors: string[] = [];
  const data = loadPlannerData();
  const articles = allArticlesUnfiltered();
  const slugs = new Set(articles.map((a) => a.slug));
  const affiliateIds = new Set(getAffiliates().map((a) => a.id));
  const destIds = new Set(data.destinations.map((d) => d.id));

  for (const d of data.destinations) {
    const where = `destination ${d.id}`;
    for (const m of MOOD_IDS) if (!(d.moods[m] >= 0 && d.moods[m] <= 3)) errors.push(`${where}: mood ${m} must be 0–3`);
    for (const p of PARTIES) if (!(d.party[p] >= 0 && d.party[p] <= 2)) errors.push(`${where}: party ${p} must be 0–2`);
    if (d.days.length !== 3) errors.push(`${where}: needs exactly three core days`);
    if (!["hotel", "resort", "villa"].includes(d.stay.kind)) errors.push(`${where}: stay kind must be hotel, resort or villa`);
    if (ATTRACTIONS.some((re) => re.test(d.stay.name))) errors.push(`${where}: "${d.stay.name}" is an attraction, not a stay`);
    if (d.stay.affiliateId && !affiliateIds.has(d.stay.affiliateId)) errors.push(`${where}: unknown affiliate ${d.stay.affiliateId}`);
    if (!data.watches.some((w) => w.id === d.watch)) errors.push(`${where}: unknown watch ${d.watch}`);
    if (!data.aromas.some((a) => a.id === d.aroma)) errors.push(`${where}: unknown aroma ${d.aroma}`);
    if (d.car) {
      if (!d.driving.suitable) errors.push(`${where}: has a car but driving is marked unsuitable`);
      for (const id of [d.car.couple, d.car.group]) if (!data.cars.some((c) => c.id === id)) errors.push(`${where}: unknown car ${id}`);
      const group = data.cars.find((c) => c.id === d.car!.group);
      if (group && group.seats < 5) errors.push(`${where}: group car must seat five`);
    }
    if (!d.arrival.airports.length) errors.push(`${where}: needs an arrival airport`);
    for (const s of d.articles) if (!slugs.has(s)) errors.push(`${where}: unknown article ${s}`);
    if (!d.image.alt) errors.push(`${where}: image needs alt text`);
    if (d.image.src && !d.image.credit) errors.push(`${where}: photo needs a credit`);
  }

  for (const a of articles) {
    const where = `article ${a.slug}`;
    if (!a.title || !a.deck) errors.push(`${where}: title and deck are required`);
    if (!["draft", "review", "published"].includes(a.status)) errors.push(`${where}: invalid status`);
    if (!a.hero?.alt) errors.push(`${where}: hero needs alt text`);
    if (a.hero?.src && !a.hero.credit) errors.push(`${where}: hero photo needs a credit`);
    if (a.section === "destinations" && !destIds.has(a.destinations[0])) errors.push(`${where}: destination stories need a known first destination`);
    for (const d of a.destinations) if (!destIds.has(d)) errors.push(`${where}: unknown destination ${d}`);
    for (const r of a.related) if (!slugs.has(r)) errors.push(`${where}: unknown related article ${r}`);
    for (const id of a.affiliates) if (!affiliateIds.has(id)) errors.push(`${where}: unknown affiliate ${id}`);
    if (/explore the journal/i.test(a.linkLabel)) errors.push(`${where}: use a specific link label`);
    if (a.basis === "research" && a.status === "published" && !a.sources.length && a.section !== "hotels") errors.push(`${where}: research stories need sources`);
  }

  for (const f of fs.readdirSync(path.join(process.cwd(), "content", "articles"))) {
    if (!f.endsWith(".md")) errors.push(`content/articles/${f}: unexpected file`);
  }
  return errors;
}
