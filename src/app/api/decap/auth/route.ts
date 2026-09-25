import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

/** Starts GitHub OAuth for Decap CMS (Prestagio Studio at /admin). */
export async function GET(req: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return new NextResponse("CMS login is not configured (GITHUB_OAUTH_CLIENT_ID).", { status: 503 });
  const state = randomBytes(16).toString("hex");
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "repo");
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", new URL("/api/decap/callback", req.url).toString());
  const res = NextResponse.redirect(url);
  res.cookies.set("decap_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/api/decap" });
  return res;
}
