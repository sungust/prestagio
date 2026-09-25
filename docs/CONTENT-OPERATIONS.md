# Content operations

## Where content lives

| Content | File(s) | Edited in |
|---|---|---|
| Articles (text, deck, dates, author/editor, SEO, sources, hero image + credit, destination tags, related, affiliate modules, status) | `content/articles/*.md` | Studio → Articles |
| Planner destinations (recommendation data) | `content/planner/destinations/*.json` | Studio → Planner data |
| Cars, watches, aromas, moods, airports | `content/planner/*.json` | Git (small, rarely changed) |
| Agoda links | `content/affiliates.json` | Studio → Affiliate links |

No application code needs to change for any of these.

## Publication workflow — nothing auto-publishes

`status` in each article is the publication gate:

| Status | prestagio.com (production) | Preview deployments |
|---|---|---|
| `draft` | hidden | hidden |
| `review` | hidden | visible, with an "In editorial review" label, `noindex` |
| `published` | visible | visible |

**All 14 launch articles are `review`.** They are research-based drafts that an editor must fact-check (sources are listed on each) and set to `published`. Until then, production shows the Planner, destinations and category pages without stories, and every page handles that state.

## Prestagio Studio (Decap CMS) at `/admin`

- Git-based: every save is a branch and pull request in `sungust/prestagio`, moving through **Draft → In review → Ready** (Decap's editorial workflow). Publishing means merging, which only an editor with repo access can do. Vercel builds a preview for each pull request.
- Setup: create a GitHub OAuth App (callback `https://prestagio.com/api/decap/callback`), then set `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` in Vercel. Editors need write access to the repo.
- The CMS script loads from unpkg. To self-host it, `npm i decap-cms-app` and bundle it.

## Importing from internal.prestagio.com

The studio could not be reached during the build, so direct integration is deferred. Instead there is a clean import path:

```bash
npm run import:studio -- export.json --dry-run
npm run import:studio -- export.json
```

Expected export: an array (or `{ "articles": [...] }`) of
`{ slug, title, deck, section, destinations?, tags?, author?, body (markdown), sources?, hero?: { src?, alt, credit?, license?, sourceUrl? }, linkLabel?, aiAssisted? }`.

The importer validates each item, never overwrites, and **always writes `status: draft`**. AI-assisted drafts get an `importNote` reminding editors to fact-check. Once the studio's API is known, the same mapping can run as a scheduled job that opens a pull request.

## Corrections

Every article links to `/contact?topic=correction&page=…`. Correct the Markdown, set `updated`, and add a line to the body noting any significant correction.

## Images

Add licensed photos through the CMS (hero → Image), with **credit, licence and alt text**. `npm run content:check` fails if a photo has no credit. Until a photo exists, the original Prestagio illustration for the chosen scene is used and credited as an illustration. Do not use images that appear to depict a specific property, car or place unless they actually do and you hold the rights.

## Checks

`npm run content:check` validates references between articles, destinations, affiliates, cars, watches and aromas, value ranges, alt text and credits, specific link labels, and that no attraction (e.g. Casa del Fascio) is listed as a stay.
