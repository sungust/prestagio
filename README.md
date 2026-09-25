# Prestagio

Luxury travel and lifestyle publication with the **Design My Escape** Planner.
Next.js 16 · TypeScript · file-based content (compiled at build) · Decap CMS · Cloudflare Workers (also Netlify / Vercel).

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: everything works without secrets
npm run dev                  # http://localhost:3000
```

Production build: `npm run build && npm run start`.
Cloudflare Workers runtime locally: `npm run cf:preview` (http://localhost:8787).

## Checks

```bash
npm run check        # typecheck + unit tests (Planner rules, content integrity, navigation) + content validation
npm run test:e2e     # Playwright, desktop + mobile (needs `npm run build` first)
npm run screenshots  # writes docs/screenshots/*.jpg
```

## Map

| Path | What |
|---|---|
| `/` | Homepage |
| `/plan`, `/plan/escape/[id]` | Planner steps 1–3, escape (steps 4–5) |
| `/destinations`, `/destinations/[place]`, `/destinations/[place]/[slug]` | Destination hubs and guides |
| `/hotels` (nav: Stays), `/cars`, `/watches`, `/aroma` + `/[section]/[slug]` | Category landing pages and articles |
| `/search`, `/about`, `/contact`, `/privacy`, `/disclosure`, `/editorial-standards`, `/credits` | Supporting pages |
| `/out/[id]` | Affiliate redirect (inactive until approved) |
| `/admin` | Prestagio Studio (Decap CMS) |

## Docs

- [docs/AUDIT.md](docs/AUDIT.md): what was found, what was kept, and what to confirm
- [docs/PLANNER.md](docs/PLANNER.md): recommendation logic and the curated dataset
- [docs/CONTENT-OPERATIONS.md](docs/CONTENT-OPERATIONS.md): editorial workflow, CMS, studio import, images
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): Cloudflare, Netlify or Vercel setup, environment variables, go-live and rollback
