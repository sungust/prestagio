# Deployment (Cloudflare, Netlify or Vercel) and rollback

**Do not change prestagio.com DNS until the preview has been reviewed.**

## Cloudflare Workers (recommended)

The site runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`). Config: `wrangler.jsonc` (Worker name `prestagio`) and `open-next.config.ts`. Prerendered pages are served read-only from Workers static assets, so **no R2, KV or D1 is needed**. The Worker bundle is about 1.3 MB compressed, which fits the free plan's 3 MB limit. The Workers Free plan allows 100,000 requests a day.

**Git-connected deploys (Workers Builds):**
1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → GitHub → `sungust/prestagio`.
2. Project/Worker name: `prestagio` (must match `name` in `wrangler.jsonc`). Production branch: `claude/amazing-darwin-salc5c` (or `main` once it exists).
3. Build command: `npx opennextjs-cloudflare build`. Deploy command: `npx opennextjs-cloudflare deploy`. Non-production branch deploy command: `npx opennextjs-cloudflare upload`. Root directory: `/`.
4. Build variables: none required. Optional: `NODE_VERSION=22`. Workers Builds sets `WORKERS_CI=1`, which the build treats as **production**: only `published` content, and indexing allowed. Add `CONTENT_STAGE=preview` only for a deliberate preview build.
5. Runtime secrets (Worker → Settings → Variables and Secrets), all optional: `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_TO`, `NEWSLETTER_WEBHOOK_URL`, `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `ANTHROPIC_API_KEY`, `AI_ENHANCEMENT_ENABLED`. `NEXT_PUBLIC_*` values are build-time: set `NEXT_PUBLIC_ANALYTICS_ENDPOINT` as a *build* variable. `NEXT_PUBLIC_SITE_URL` defaults to `https://prestagio.com`.
6. Domain: Worker → Settings → **Domains & Routes → Add → Custom domain** → `prestagio.com`, and `www.prestagio.com`. This requires the prestagio.com zone to be on Cloudflare. If DNS is elsewhere, add the site to Cloudflare first (which changes nameservers), or keep DNS where it is and deploy on Netlify or Vercel instead.
7. Rollback: Worker → **Deployments** → previous version → **Rollback**. Or remove the custom domain and restore the saved DNS records.

**From a terminal** (needs `wrangler login` or a `CLOUDFLARE_API_TOKEN`): `npm run cf:preview` runs the Workers runtime locally, and `npm run cf:deploy` deploys.

Content is compiled into the build (`npm run content:build`, run automatically before `dev`, `build` and `test`), because Workers have no filesystem at request time. Every content change therefore needs a rebuild, which Git-connected deploys do automatically.

## Netlify

1. Netlify → **Add new site → Import an existing project → GitHub →** `sungust/prestagio`.
2. Branch to deploy: `claude/amazing-darwin-salc5c` (or `main` once it exists). Base directory: empty. `netlify.toml` supplies the build command (`npm run build`), the publish directory (`.next`) and Node 22. Netlify's Next.js runtime is installed automatically.
3. Environment variables (Site configuration → Environment variables): `NEXT_PUBLIC_SITE_URL=https://prestagio.com`. Optional keys are the same as the Vercel table below; set them for **Builds and Functions** scopes.
4. The publication gate reads Netlify's `CONTEXT` at build time. Production deploys show only `published` content and allow indexing. Deploy previews and branch deploys also show `review` content and are `noindex`.
5. Domains: Site configuration → **Domain management** → add `prestagio.com` (primary) and `www`. Record the existing DNS first (see Rollback).
6. Rollback: Deploys → pick a previous deploy → **Publish deploy**.

## Vercel

## 1. Connect the repository

1. In Vercel: **Add New → Project → Import** `sungust/prestagio`. The framework is detected as Next.js, so no `vercel.json` is needed.
2. Production branch: `main`. Every other branch or pull request (e.g. `claude/amazing-darwin-salc5c`) gets a **preview URL** automatically.

## 2. Environment variables (Project → Settings → Environment Variables)

| Variable | Needed for | Scope |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` = `https://prestagio.com` | canonical URLs, sitemap | Production (preview: its own URL, optional) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_TO` | "Email me this escape", contact form | Production + Preview |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT`, `NEXT_PUBLIC_ANALYTICS_DOMAIN` | privacy-conscious analytics (Plausible-compatible) | Production |
| `NEWSLETTER_WEBHOOK_URL` | forwarding explicit newsletter opt-ins | Production |
| `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` | Studio login at `/admin` | Production |
| `ANTHROPIC_API_KEY`, `AI_ENHANCEMENT_ENABLED`, `AI_DAILY_REQUEST_CAP`, `ANTHROPIC_MODEL` | optional AI paragraph | Production (off by default) |
| `CONTENT_STAGE` | override the publication gate; leave unset | — |

Without these, every feature degrades gracefully: email and contact explain they are unavailable and offer a link or `mailto:` instead, analytics is a no-op, and the CMS login returns 503.

`VERCEL_ENV` (Vercel) or `CONTEXT` (Netlify) is read at build time. Production shows only `published` content. Previews also show `review` content and are `noindex` (robots.txt disallows everything on previews).

## 3. Review the preview

Checklist: homepage, all five Planner steps (desktop and mobile), one escape, `/hotels`, `/cars`, `/watches`, `/aroma`, `/destinations`, an article, `/stays` → `/hotels`, `/contact`, 404.

## 4. Go live

1. Publish the articles you have fact-checked (`status: published`) and merge to `main`.
2. Add any legacy-URL redirects discovered on the live site (see AUDIT.md).
3. Vercel → Project → **Domains** → add `prestagio.com` and `www.prestagio.com`, then follow Vercel's DNS instructions at your registrar. Keep the old host running until the new site is verified.

## Rollback

- **Before DNS change:** nothing to roll back. The current site is untouched.
- **After DNS change, app problem:** Vercel → Deployments → pick the previous good deployment → **Instant Rollback** (seconds, no rebuild).
- **Revert entirely to the old site:** restore the previous DNS records at the registrar (note them down *before* switching, and lower their TTL to 300 s a day in advance so changes propagate quickly).
- **Bad content:** revert the content commit in Git, and Vercel redeploys automatically.
