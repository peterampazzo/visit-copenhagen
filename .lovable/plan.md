# Restructure guide sections

## Goal
Fewer, clearer top-level sections so the nav (chips + mobile bottom sheet) is short and scannable for any age, without adding features or weight. Pure reorganization of existing content — no new dependencies, no new pages.

## Current state
10 top-level sections, several with a single small group: Fun facts (1 group), Pastries (1 group), Saunas (1 group), Boats (1 group). On mobile the section nav and bottom-sheet menu are long lists of tiny targets.

## Proposed new structure (7 sections)

1. **Things to know** 🧯 — unchanged (transport, cycling, everyday life) + **"Very Danish things"** moves here as a group.
2. **Places & stories** 🏰 — unchanged.
3. **Eat & drink** 😋 — merge Food (markets, dining, coffee) + Pastries (bakeries) as groups of one section.
4. **Museums** 🏺 — unchanged.
5. **On the water** ⛵ — merge Saunas + Boats (both are small; both are water activities).
6. **Beyond Copenhagen** 🚆 — unchanged.
7. **Inspiration** 🗓️ — unchanged (calendar pills already work well).

Result: 10 sections → 7, every nav chip leads to a substantial section, mobile bottom-sheet menu fits without scrolling.

## What changes technically
- `src/locales/en/guide.yaml` and `src/locales/it/guide.yaml`: move group blocks under the merged sections, adjust emoji/titles. Item IDs stay the same, so saved favourites and map pins keep working.
- `src/lib/guide-content.ts`: update `GUIDE_ORDER` (10 entries → 7, group keys unchanged).
- `src/components/guide/GuideSection.tsx`: `SECTION_THEMES` cycles by index — still fine with 7.
- No component, map, or logic changes. Content keys that are referenced by ID (map locations) are untouched.

## Alternatives considered
- Keep 10 sections: rejected — several are one-group stubs, nav too long on phones.
- Tabs/accordion layout: rejected — heavier, worse for "any age" simplicity; single scroll page stays.

## Verification
- Build passes.
- Playwright mobile check (390×844): nav chips and bottom-sheet menu all visible, each merged section renders its groups, search still filters across merged content, favourites/map pins unaffected.
