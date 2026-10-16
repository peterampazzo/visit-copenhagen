import { readFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";
import { parse } from "yaml";

const en = parse(readFileSync("src/locales/en/guide.yaml", "utf8"));
const reelItems = Object.values(
  en.reels.items as Record<string, { image?: string; theme?: string }>,
);
const totalReels = reelItems.length;

function pillGroup(page: Page) {
  return page.getByRole("group", { name: "From the feed" });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "From the feed" }).scrollIntoViewIfNeeded();
});

test("shows all reels by default with theme pills", async ({ page }) => {
  const pills = pillGroup(page).getByRole("button");
  await expect(pills).toHaveText([
    "All",
    "Danish life",
    "Getting around",
    "Hidden spots",
    "Beyond Copenhagen",
  ]);
  await expect(pills.first()).toHaveAttribute("aria-pressed", "true");

  await expect(page.locator("[data-reel-index]")).toHaveCount(totalReels);
  await expect(page.getByText(/^\d+ of \d+$/)).toHaveText(/^1 of \d+$/);
});

test("filtering by theme updates cards and counter", async ({ page }) => {
  const expected = reelItems.filter((item) => item.theme === "transport").length;

  await pillGroup(page).getByRole("button", { name: "Getting around" }).click();
  const cards = page.locator("[data-reel-index]");
  await expect(cards).toHaveCount(expected);
  await expect(page.getByText(/^\d+ of \d+$/)).toHaveText(`1 of ${expected}`);

  for (const href of await cards.locator("a").all()) {
    expect(await href.getAttribute("href")).toContain("instagram.com");
  }

  await pillGroup(page).getByRole("button", { name: "All" }).click();
  await expect(cards).toHaveCount(totalReels);
});

test("every reel thumbnail is served", async ({ page }) => {
  const imgs = page.locator("[data-reel-index] img");
  const expected = reelItems.filter((item) => item.image).length;
  await expect(imgs).toHaveCount(expected);

  for (const src of await imgs.evaluateAll((els) =>
    els.map((el) => (el as HTMLImageElement).src),
  )) {
    const res = await page.request.get(src);
    expect(res.status(), src).toBe(200);
    expect(res.headers()["content-type"], src).toMatch(/^image\//);
  }
});

test("reel cards open Instagram in a new tab", async ({ page }) => {
  const link = page.locator("[data-reel-index] a").first();
  await expect(link).toHaveAttribute("target", "_blank");
  expect(await link.getAttribute("rel")).toContain("noreferrer");
});

test("Nyhavn card links to its reel", async ({ page }) => {
  const link = page.locator('a[href*="DdtuOratq5i"]');
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
  await expect(link).toHaveText(/Watch the reel/);
});

for (const { place, shortcode } of [
  { place: "Grundtvig's Church", shortcode: "DeDUN-GMpju" },
  { place: "University Library in Fiolstræde", shortcode: "DecPZt4thtI" },
]) {
  test(`${place} story shows its reel`, async ({ page }) => {
    const card = page
      .locator("article")
      .filter({ has: page.getByRole("heading", { name: place }) });
    await card.scrollIntoViewIfNeeded();
    await card.getByRole("button", { name: "The story" }).click();
    await expect(page.getByRole("dialog").locator(`a[href*="${shortcode}"]`)).toBeVisible();
  });
}

test("Italian toggle translates the strip", async ({ page }) => {
  await page
    .getByRole("group", { name: "Language" })
    .getByRole("button", { name: /Italiano/ })
    .click();

  await expect(page.getByRole("heading", { name: "Dal feed" })).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Dal feed" }).getByRole("button", { name: "Vita danese" }),
  ).toBeVisible();
  await expect(page.getByText(/^\d+ di \d+$/)).toHaveText(/^1 di \d+$/);
});
