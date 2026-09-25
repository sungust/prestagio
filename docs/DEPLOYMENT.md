# Deployment (Vercel) and rollback

**Do not change prestagio.com DNS until the preview has been reviewed.**

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

`VERCEL_ENV` is set by Vercel. Production shows only `published` content. Previews also show `review` content and are `noindex` (robots.txt disallows everything on previews).

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
