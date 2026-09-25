// OpenNext adapter configuration for Cloudflare Workers.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Content only changes through Git, and every change rebuilds the site, so
  // prerendered pages are served read-only from Workers static assets.
  // No R2 or KV bucket is needed.
  incrementalCache: staticAssetsIncrementalCache,
  // Cache interception stays off: it answered the router's RSC data requests with
  // the prerendered HTML, so open pages retried about 30 times a second and
  // exhausted the Workers daily request quota.
  enableCacheInterception: false,
});
