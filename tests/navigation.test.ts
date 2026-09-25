import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PLAN_HREF, PRIMARY_NAV } from "@/lib/site";
import nextConfig from "../next.config";

const app = path.join(process.cwd(), "src", "app");
const routeExists = (href: string) => fs.existsSync(path.join(app, href, "page.tsx"));

describe("navigation", () => {
  it("has the primary navigation from the brief, in order", () => {
    expect(PRIMARY_NAV.map((n) => n.label)).toEqual(["Destinations", "Stays", "Cars", "Watches", "Aroma"]);
    expect(PLAN_HREF).toBe("/plan");
  });

  it("links only to routes that exist", () => {
    for (const n of PRIMARY_NAV) expect(routeExists(n.href), n.href).toBe(true);
    expect(routeExists(PLAN_HREF)).toBe(true);
  });

  it("keeps the existing public routes", () => {
    for (const r of ["/hotels", "/cars", "/watches", "/aroma"]) expect(routeExists(r), r).toBe(true);
  });

  it("does not put Journal, The Edit or Issue 01 in the navigation", () => {
    for (const n of PRIMARY_NAV) expect(n.label).not.toMatch(/journal|the edit|issue/i);
  });

  it("redirects /stays to /hotels permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual(expect.objectContaining({ source: "/stays", destination: "/hotels", permanent: true }));
    for (const r of redirects) expect(routeExists(r.destination.replace(/\/:.*$/, "")) || r.destination.includes(":")).toBe(true);
  });
});
