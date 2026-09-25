import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function page(status: "success" | "error", content: object) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // Hand the token to the CMS window that opened this popup (Decap's standard handshake).
  const html = `<!doctype html><script>
(function(){function r(e){if(e.origin!==window.location.origin)return;window.opener.postMessage(${JSON.stringify(message)}, e.origin);window.removeEventListener("message",r);}
window.addEventListener("message", r); window.opener.postMessage("authorizing:github", "*");})();
</script>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = (await cookies()).get("decap_state")?.value;
  if (!code || !state || state !== expected) return page("error", { message: "Invalid login state" });
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: process.env.GITHUB_OAUTH_CLIENT_ID, client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET, code }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => null)) as { access_token?: string } | null;
  if (!data?.access_token) return page("error", { message: "GitHub login failed" });
  return page("success", { token: data.access_token, provider: "github" });
}
