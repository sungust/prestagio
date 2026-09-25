import { describe, expect, it } from "vitest";
import { contentErrors } from "@/lib/content/validate";
import { allArticlesUnfiltered } from "@/lib/content/articles";
import { getAffiliates, isLive } from "@/lib/content/affiliates";
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
  it("keeps every link inactive until approved", () => {
    for (const a of getAffiliates()) expect(isLive(a)).toBe(false);
  });

  it("only activates approved https links on the programme's domain", () => {
    const base = { id: "x", label: "x", program: "agoda" as const, fallbackPath: "/hotels" };
    expect(isLive({ ...base, approved: true, url: "https://www.agoda.com/partners/example" })).toBe(true);
    expect(isLive({ ...base, approved: false, url: "https://www.agoda.com/partners/example" })).toBe(false);
    expect(isLive({ ...base, approved: true, url: "https://agoda.com.evil.example/x" })).toBe(false);
    expect(isLive({ ...base, approved: true, url: "http://www.agoda.com/x" })).toBe(false);
  });
});
