import { existsSync, readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";
import { parse } from "yaml";

const en = parse(readFileSync("src/locales/en/guide.yaml", "utf8"));
const it = parse(readFileSync("src/locales/it/guide.yaml", "utf8"));

test("EN and IT reels have identical keys and language-neutral fields", () => {
  const enItems = en.reels.items as Record<string, Record<string, string>>;
  const itItems = it.reels.items as Record<string, Record<string, string>>;
  const enThemes = Object.keys(en.reels.themes ?? {});
  const itThemes = Object.keys(it.reels.themes ?? {});

  expect(Object.keys(itItems)).toEqual(Object.keys(enItems));

  for (const key of Object.keys(enItems)) {
    for (const field of ["image", "url", "creator", "theme"] as const) {
      expect(itItems[key]?.[field], `${key}.${field}`).toEqual(enItems[key]?.[field]);
    }
    expect(enThemes, `${key} theme (en)`).toContain(enItems[key]?.theme);
    expect(itThemes, `${key} theme (it)`).toContain(itItems[key]?.theme);
    for (const item of [enItems[key], itItems[key]]) {
      expect(item?.caption?.length, `${key}.caption`).toBeGreaterThan(0);
      expect(item?.caption?.startsWith("TODO"), `${key}.caption`).toBe(false);
    }
  }
});

test("every reel thumbnail exists and is a JPEG", () => {
  for (const [key, item] of Object.entries(en.reels.items as Record<string, { image?: string }>)) {
    if (!item.image) continue;
    const path = `public${item.image}`;
    expect(existsSync(path), `${key}: ${path}`).toBe(true);
    const bytes = readFileSync(path);
    expect([bytes[0], bytes[1]], `${key}: ${path} magic bytes`).toEqual([0xff, 0xd8]);
  }
});

test("place-card media thumbnails exist", () => {
  for (const section of Object.values(en.sections as Record<string, { groups?: object }>)) {
    for (const group of Object.values(section.groups ?? {})) {
      for (const [key, item] of Object.entries(
        (group as { items?: Record<string, { media?: { image?: string } }> }).items ?? {},
      )) {
        if (!item.media?.image) continue;
        const path = `public${item.media.image}`;
        expect(existsSync(path), `${key}: ${path}`).toBe(true);
      }
    }
  }
});
