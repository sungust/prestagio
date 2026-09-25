import { expect, test } from "@playwright/test";

test("homepage: one hero action leads into the Planner", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /go somewhere extraordinary/i })).toBeVisible();
  const hero = page.locator(".hero");
  await expect(hero.getByRole("link")).toHaveCount(1);
  await hero.getByRole("link", { name: /design my escape/i }).click();
  await expect(page).toHaveURL(/\/plan/);
  await expect(page.getByRole("heading", { level: 1, name: /how do you want to feel/i })).toBeVisible();
});

test("primary navigation reaches every section", async ({ page, isMobile }) => {
  for (const [label, path, heading] of [
    ["Destinations", "/destinations", /destinations/i],
    ["Stays", "/hotels", /stays/i],
    ["Cars", "/cars", /cars/i],
    ["Watches", "/watches", /watches/i],
    ["Aroma", "/aroma", /aroma/i],
  ] as const) {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: /open menu/i }).click();
    await page.getByRole("navigation", { name: isMobile ? "Primary mobile" : "Primary" }).getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
});

test("header Plan an Escape opens the same Planner", async ({ page }) => {
  await page.goto("/cars");
  await page.getByRole("banner").getByRole("link", { name: /plan an escape/i }).click();
  await expect(page).toHaveURL(/\/plan$/);
});

test("the complete five-step Planner flow", async ({ page }) => {
  await page.goto("/plan");
  // Step 1: choose feelings
  await page.getByText("Disappear by the sea", { exact: true }).click();
  await page.getByText("Art and architecture", { exact: true }).click();
  await page.getByRole("button", { name: /^continue/i }).click();
  // Step 2: boundaries (all optional)
  await expect(page.getByRole("heading", { level: 1, name: /set the boundaries/i })).toBeVisible();
  await page.getByLabel("Departing from").fill("London (LHR)");
  await page.getByLabel("When").selectOption("6");
  await page.getByLabel("How long").selectOption("4");
  await page.getByRole("radio", { name: "Couple" }).check();
  await page.getByRole("button", { name: /reveal my escapes/i }).click();
  // Step 3: three distinct escapes
  await expect(page.getByRole("heading", { level: 1, name: /three escapes/i })).toBeVisible();
  const cards = page.locator(".escape-card");
  await expect(cards).toHaveCount(3);
  const names = await cards.locator("h3").allTextContents();
  expect(new Set(names).size).toBe(3);
  await expect(cards.first()).toContainText(/flying from London/);
  // Step 4: explore
  await cards.first().getByRole("link", { name: /explore this escape/i }).click();
  await expect(page).toHaveURL(/\/plan\/escape\/[a-z]+\?/);
  for (const h of [/why this escape is yours/i, /days in/i, /how the escape comes together/i]) await expect(page.getByRole("heading", { name: h })).toBeVisible();
  // Step 5: save
  await page.getByRole("button", { name: /save this escape/i }).click();
  await expect(page.getByRole("button", { name: /saved to this device/i })).toBeVisible();
  await page.goto("/plan#saved");
  await expect(page.locator("#saved li")).toHaveCount(1);
});

test("back button returns to the previous Planner step", async ({ page }) => {
  await page.goto("/plan?m=city&step=2");
  await page.getByRole("button", { name: /reveal my escapes/i }).click();
  await expect(page.getByRole("heading", { level: 1, name: /three escapes/i })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: /set the boundaries/i })).toBeVisible();
});

test("email is offered only on request, with an unchecked marketing opt-in", async ({ page }) => {
  await page.goto("/plan/escape/kyoto?m=art");
  await expect(page.getByLabel("Email address")).toHaveCount(0);
  await page.getByRole("button", { name: /email me this escape/i }).click();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /newsletter/i })).not.toBeChecked();
});

test("no car where driving is impractical", async ({ page }) => {
  await page.goto("/plan/escape/venice");
  await expect(page.getByRole("heading", { name: "Private water taxi" })).toBeVisible();
  await expect(page.getByText(/why not a car\?/i)).toBeVisible();
});

test("an article renders with sources and a research note", async ({ page }) => {
  await page.goto("/destinations/como/lake-como-beyond-the-postcard");
  await expect(page.getByRole("heading", { level: 1, name: /lake como, beyond the postcard/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.getByText(/based on research/i).first()).toBeVisible();
});

test("legacy and alias routes redirect", async ({ page }) => {
  await page.goto("/stays");
  await expect(page).toHaveURL(/\/hotels$/);
});

test("inactive affiliate links fall back to editorial pages", async ({ request }) => {
  const res = await request.get("/out/agoda-como-villa-deste", { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers().location).toContain("/hotels/where-to-stay-on-lake-como");
});

test("unknown pages show a helpful 404", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /a road not on the map/i })).toBeVisible();
});
