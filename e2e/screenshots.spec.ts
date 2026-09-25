import { test } from "@playwright/test";

// Captures review screenshots into docs/screenshots. Run: npm run screenshots
const PAGES = [
  ["home", "/"],
  ["planner-1-feeling", "/plan?m=sea.art&step=1"],
  ["planner-2-boundaries", "/plan?m=sea.art&from=LHR&mo=6&n=4&p=couple&b=3&step=2"],
  ["planner-3-reveal", "/plan?m=sea.art&from=LHR&mo=6&n=4&p=couple&b=3&step=3"],
  ["planner-4-5-escape", "/plan/escape/como?m=sea.art&from=LHR&mo=6&n=4&p=couple&b=3"],
  ["category-stays", "/hotels"],
  ["category-cars", "/cars"],
  ["destination-kyoto", "/destinations/kyoto"],
  ["article", "/destinations/como/lake-como-beyond-the-postcard"],
] as const;

for (const [name, path] of PAGES) {
  test(`screenshot ${name}`, async ({ page }, info) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.screenshot({ path: `docs/screenshots/${info.project.name}-${name}.jpg`, fullPage: true, type: "jpeg", quality: 62 });
  });
}
