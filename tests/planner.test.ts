import { describe, expect, it } from "vitest";
import { loadPlannerData } from "@/lib/planner/data";
import { adaptDays, chooseTransport, escapeFor, recommend, scoreDestination } from "@/lib/planner/engine";
import { estimateFlight, greatCircleKm } from "@/lib/planner/estimate";
import { decodeInput, encodeInput } from "@/lib/planner/query";
import type { PlannerInput } from "@/lib/planner/types";

const data = loadPlannerData();
const byId = (id: string) => data.destinations.find((d) => d.id === id)!;
const ids = (input: PlannerInput) => recommend(input, data).map((e) => e.destination.id);

describe("recommend", () => {
  it("always returns three escapes, even with no answers", () => {
    expect(recommend({ moods: [] }, data)).toHaveLength(3);
  });

  it("returns three genuinely distinct escapes: no shared group, no shared country", () => {
    const inputs: PlannerInput[] = [
      { moods: ["sea"] },
      { moods: ["art", "city"] },
      { moods: ["drive"], party: "family" },
      { moods: ["weekend"], from: "LHR", nights: 3 },
      { moods: ["lifetime", "wellness"], nights: 10, budget: 4 },
    ];
    for (const input of inputs) {
      const escapes = recommend(input, data);
      expect(new Set(escapes.map((e) => e.destination.group)).size).toBe(3);
      expect(new Set(escapes.map((e) => e.destination.country)).size).toBe(3);
    }
  });

  it("is deterministic", () => {
    const input: PlannerInput = { moods: ["sea", "art"], from: "JFK", month: 5, nights: 5, party: "couple", budget: 3 };
    expect(ids(input)).toEqual(ids(input));
  });

  it("puts a strong mood match first", () => {
    expect(ids({ moods: ["drive"] })[0]).toMatch(/engadin|highlands|capetown|riviera/);
    expect(["maldives", "amalfi"]).toContain(ids({ moods: ["sea", "lifetime", "wellness"] })[0]);
  });

  it("avoids long-haul escapes for a short trip from Europe", () => {
    const result = ids({ moods: ["weekend", "art"], from: "LHR", nights: 3 });
    for (const far of ["maldives", "kyoto", "capetown"]) expect(result).not.toContain(far);
  });

  it("penalises destinations that are out of season", () => {
    const winter = scoreDestination(byId("amalfi"), { moods: ["sea"], month: 1 }, data.airports);
    const summer = scoreDestination(byId("amalfi"), { moods: ["sea"], month: 6 }, data.airports);
    expect(winter.score).toBeLessThan(summer.score);
    expect(winter.cautions.join(" ")).toMatch(/out of season/);
  });

  it("explains a budget mismatch rather than hiding it", () => {
    const s = scoreDestination(byId("maldives"), { moods: ["sea"], budget: 1 }, data.airports);
    expect(s.cautions.join(" ")).toMatch(/above your comfortable range/);
  });

  it("every reason shown is produced by a scoring rule", () => {
    const e = escapeFor("como", { moods: ["art"], month: 5, nights: 4, party: "couple" }, data)!;
    expect(e.reasons).toContain(byId("como").moodNotes.art);
    expect(e.reasons).toContain("May is one of the best months to go.");
    expect(e.reasons).toContain("4 nights is an ideal length here.");
  });
});

describe("transport", () => {
  it("never recommends a car where driving is impractical", () => {
    for (const d of data.destinations.filter((x) => !x.driving.suitable)) {
      for (const party of ["couple", "family"] as const) expect(chooseTransport(d, data, party).kind).toBe("transfer");
    }
  });

  it("chooses a five-seat car for families", () => {
    for (const d of data.destinations.filter((x) => x.driving.suitable && x.car)) {
      const t = chooseTransport(d, data, "family");
      expect(t.kind).toBe("car");
      if (t.kind === "car") expect(t.car.seats).toBeGreaterThanOrEqual(5);
    }
  });
});

describe("itinerary", () => {
  it("starts from three days and grows with trip length", () => {
    expect(adaptDays(byId("kyoto"))).toHaveLength(3);
    expect(adaptDays(byId("kyoto"), 2)).toHaveLength(3);
    expect(adaptDays(byId("kyoto"), 5)).toHaveLength(5);
    expect(adaptDays(byId("paris"), 14).length).toBe(3 + byId("paris").moreDays.length);
  });
});

describe("travel estimates", () => {
  it("computes great-circle distance", () => {
    expect(Math.round(greatCircleKm({ lat: 51.47, lon: -0.454 }, { lat: 40.641, lon: -73.778 }))).toBeGreaterThan(5500);
  });

  it("estimates plausible flying times and marks nearby airports as no flight", () => {
    const lhr = data.airports.find((a) => a.iata === "LHR")!;
    const como = estimateFlight(lhr, byId("como"))!;
    expect(como.hours).toBeGreaterThanOrEqual(1.5);
    expect(como.hours).toBeLessThanOrEqual(2.5);
    const mxp = data.airports.find((a) => a.iata === "MXP")!;
    expect(estimateFlight(mxp, byId("como"))!.hours).toBe(0);
  });

  it("shows no estimate for an unknown departure point", () => {
    expect(escapeFor("como", { moods: [], from: "Atlantis" }, data)!.flight).toBeNull();
  });
});

describe("query encoding", () => {
  it("round-trips planner answers through the URL", () => {
    const input: PlannerInput = { moods: ["sea", "drive"], from: "LHR", month: 6, nights: 4, party: "couple", budget: 3 };
    expect(decodeInput(new URLSearchParams(encodeInput(input)))).toEqual(input);
  });

  it("ignores invalid values", () => {
    const i = decodeInput(new URLSearchParams("m=sea.hack&mo=13&n=-1&p=army&b=9"));
    expect(i).toEqual({ moods: ["sea"], from: undefined, month: undefined, nights: undefined, party: undefined, budget: undefined });
  });
});
