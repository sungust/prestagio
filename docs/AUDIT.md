# Audit — 25 September 2026

## What was inspected

| Item | Finding |
|---|---|
| Repository `sungust/prestagio` | **Empty.** No commits, no branches, no files. There was no existing framework, routes, deployment config, environment variables, content, images, analytics or contact code to inspect or migrate. |
| Live site `prestagio.com` | **Not reachable from the build environment** (network policy denies the host). Could not inspect markup, calculator logic, analytics or the contact action. |
| `internal.prestagio.com` | **Not reachable** (same policy). The studio's data model and export format are unknown. |
| Image hosts (Unsplash, Wikimedia) | Not reachable. No licensed photography was available. |

## What we know from the brief (and preserved)

- `/hotels`, `/cars`, `/watches`, `/aroma` exist on the live site → **kept at the same URLs**, rebuilt as landing pages. "Stays" in the navigation points to `/hotels`; `/stays` → `/hotels` (301).
- A homepage **journey cost calculator** exists → its inputs could not be inspected. Following the brief, it is **replaced by a clearly-labelled estimate model** ("Journey details" on each escape): great-circle distance and approximate flying time only. No fares, tolls or fuel costs are shown, because none could be sourced reliably. `/calculator` redirects to `/plan` in case the old calculator had its own URL.
- A **contact action** exists → rebuilt as `/contact` (form + `mailto:` fallback), plus a correction route from every article.

## Things to confirm against the live site before DNS changes

1. **Any other live URLs** (individual hotel/car/watch/aroma pages, old article slugs, `/contact` variants). Export the live sitemap or analytics top pages and add redirects in `next.config.ts` → `redirects()`. Nothing here can remove production data: the old site keeps running until DNS is switched.
2. **Existing content** worth migrating (text, images you hold rights to). Import via `npm run import:studio` (see CONTENT-OPERATIONS.md) or the CMS.
3. **The calculator's sources.** If it used a reliable fare/distance API you want to keep, it can return as an extra panel inside "Journey details".
4. **Analytics** currently used (IDs, provider) so historical reporting continues. Set `NEXT_PUBLIC_ANALYTICS_ENDPOINT`.
5. **Contact destination address** currently used. Set `CONTACT_TO`.
6. **internal.prestagio.com export format**, to finalise the importer mapping.

## Implementation plan (as executed)

1. Next.js 16 App Router, TypeScript, self-hosted fonts, plain CSS design tokens (no UI framework) for speed and control.
2. Design system + homepage following the mockup: minimal header, cinematic hero with one CTA, overlapping Planner preview, image-led stories, "A complete escape" sequence, category entrances, refined footer.
3. Five-step Planner with a curated JSON dataset and a deterministic, explainable matching engine; shareable URLs; save / share / email-on-request.
4. Category landing pages, destination hubs and a flexible article template (sources, credits, dates, research labelling, corrections, related stories, commercial modules).
5. Agoda-ready affiliate modules: config-driven, inactive until approved, disclosed, tracked anonymously.
6. Editorial workflow: Decap CMS (Draft → In review → Ready) on the Git repo, plus an importer for studio exports; a publication gate so nothing auto-publishes.
7. Tests (Vitest + Playwright), accessibility and mobile passes, screenshots.

## Reusable components and content

`Scene` (original SVG illustrations), `Media`/`Figure` (photo-or-illustration with credits), `StoryCard`/`ArticleCard`, `SectionHead`, `CategoryPage`, `ArticleView`, `AffiliateModule`, `MoodPicker`, Planner components. Content: 14 research-based articles (status `review`), 12 curated destinations, 6 cars, 12 watches, 12 aroma compositions, 35 departure airports.
