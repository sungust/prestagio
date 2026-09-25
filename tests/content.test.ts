import { describe, expect, it } from "vitest";
import { contentErrors } from "@/lib/content/validate";
import { allArticlesUnfiltered } from "@/lib/content/articles";
import { getAffiliates, isLive } from "@/lib/content/affiliates";
import { AGODA_CID, AGODA_CITIES, agodaUrl } from "@/lib/agoda";
import { loadPlannerData } from "@/lib/planner/data";

describe("content integrity", () => {
  it("has no validation errors", () => {
    expect(contentErrors()).toEqual([]);
  });

  it("never presents Casa del Fascio as a stay", () => {
    for (const d of loadPlannerData().destinations) expect(d.stay.name).not.toMatch(/fascio/i);
    const como = allArticlesUnfiltered().find((a) => a.slug === "lake-como-beyond-the-postcard")!;
    expect(como.html).toMatch(/not a place to stay/);
  });

  it("does not auto-publish: research drafts are not marked published", () => {
    for (const a of allArticlesUnfiltered()) expect(["draft", "review"]).toContain(a.status);
  });

  it("never uses generic journal calls to action", () => {
    for (const a of allArticlesUnfiltered()) expect(a.linkLabel).not.toMatch(/journal/i);
  });
});

describe("affiliate links", () => {
  it("puts Prestagio's partner ID on every live link, and keeps unapproved links off", () => {
    for (const a of getAffiliates()) {
      if (!a.approved) expect(isLive(a)).toBe(false);
      else expect(new URL(a.url).searchParams.get("cid")).toBe(AGODA_CID);
    }
  });

  it("builds stay searches with the partner ID for every destination", () => {
    const { destinations } = loadPlannerData();
    for (const d of destinations) {
      const city = AGODA_CITIES[d.id];
      expect(city, d.id).toBeDefined();
      const u = new URL(agodaUrl({ city: city.id, checkIn: "2026-10-12", checkOut: "2026-10-15", adults: 2 }));
      expect(u.hostname).toBe("www.agoda.com");
      expect(u.searchParams.get("cid")).toBe(AGODA_CID);
      expect(u.searchParams.get("city")).toBe(String(city.id));
    }
  });

  it("only activates approved https links on the programme's domain", () => {
    const base = { id: "x", label: "x", program: "agoda" as const, fallbackPath: "/hotels" };
    expect(isLive({ ...base, approved: true, url: "https://www.agoda.com/partners/example" })).toBe(true);
    expect(isLive({ ...base, approved: false, url: "https://www.agoda.com/partners/example" })).toBe(false);
    expect(isLive({ ...base, approved: true, url: "https://agoda.com.evil.example/x" })).toBe(false);
    expect(isLive({ ...base, approved: true, url: "http://www.agoda.com/x" })).toBe(false);
  });
});
