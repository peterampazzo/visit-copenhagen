# Section & card UI refinement (direction 2, applied to the existing page)

You're right — the previews were standalone mockups. This plan takes only the *ideas* from direction 2 ("Ink & Pastel Scandi") and applies them to the components already in the app. No rebuild, no new fonts, no new colors, no new dependencies, no content or feature changes.

## What stays exactly as-is
- All 10 sections, all groups, all content and YAML files.
- Existing palette (cream / ink / sun / coral / harbour) and fonts (Outfit + Figtree).
- Search, favourites star, story dialog, map pin, calendar pills, mobile bottom nav, "Beyond Copenhagen" — untouched logic.

## What changes (presentation only)

**1. Cards become separate cards instead of a divided grid** — `PlaceCard.tsx` + `GuideSection.tsx`
Today items sit in a `gap-px` grid on an ink background, so they read as one dense table. Change to individually rounded cards with a 2px ink/15 border and the existing `shadow-pop`-style offset shadow, spaced with a real gap. Easier to parse for any age; also fixes the cramped feel on phones.

**2. Groups get a panel, not just a heading** — `GuideSection.tsx`
Wrap each group's cards in a soft panel (card background at low opacity, 2px border, rounded) with the group title as a small uppercase tracked label above it — same treatment the calendar block already uses, so it becomes consistent across the page. Keeps the red dot marker.

**3. Card interior gets a clearer hierarchy** — `PlaceCard.tsx`
- Kicker stays as the small uppercase label, tinted with the section accent instead of always harbour.
- Name goes up one step in size and stays the tap target for the map.
- Note gets full-width room (no clamp) with slightly looser line height.
- Story / link / travel move into a single bottom action row separated by a hairline divider, so every card ends with the same predictable strip.
- Star moves to the top-right corner of the card at min 44×44 tap size (currently 32px).

**4. Section header slightly calmer** — `GuideSection.tsx`
Keep the tilted emoji tile and big display title, but reduce the title from `text-5xl` to a size that doesn't wrap on a 390px screen, and give the blurb more line height.

**5. Motion stays light**
Same `whileInView` fade/slide already in place; only add a small tap/press feedback on cards. No new animation library.

## Technical notes
- Files touched: `src/components/guide/PlaceCard.tsx`, `src/components/guide/GuideSection.tsx`, and small token additions in `src/styles.css` if a softer shadow variant is needed.
- All colors via existing tokens — no hardcoded hex or `text-white`/`bg-black`.
- Tap targets ≥44px, body text ≥16px on mobile.

## Verification
- Build + typecheck pass.
- Playwright at 390×844: screenshot Places, Food, Inspiration sections; confirm no text wraps awkwardly, star/story/map all still work, search filtering still collapses sections.
