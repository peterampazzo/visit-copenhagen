# What I'd improve in the current version

Based on a fresh read of the app (`App.tsx`, `GuideSection.tsx`, `PlaceCard.tsx`, map components), here is my honest, prioritized list. All items keep the app lightweight, mobile-first, and simple for any age. No new dependencies, no restructuring of the 10 sections, no content changes.

## Priority 1 — Fix what still feels broken

**1.1 Text truncation in the map list**
The map's place list still clamps notes with `line-clamp-2` (`GuideMapDialog.tsx`), so descriptions end in "…" with no way to read the rest. The main-page cards no longer clamp — make the map list consistent: show the full note, or tap-to-expand.

**1.2 Geolocation dead end**
Tapping "locate me" shows the crossed-out icon when permission is denied, with no explanation. Add a permission-state check: when blocked, show the localized `locationDenied` hint ("Location is blocked — enable it in your browser settings"); request permission on tap rather than relying on the MapLibre control's silent failure.

## Priority 2 — Card readability (the biggest visual win)

**2.1 Separate cards instead of the divided grid**
Today each group's items sit in a `gap-px` grid on an ink background (`GuideSection.tsx` `renderCards`), reading as one dense table. Change to individual rounded cards with the existing ink border + offset shadow and real gaps — much easier to scan on a phone, same palette.

**2.2 Consistent action row per card**
Story / link / travel badge currently appear in slightly different spots per card. Move them into one predictable bottom row separated by a hairline divider.

**2.3 Star tap target too small**
The favourite star is `h-8 w-8` (32px) in `PlaceCard.tsx` — below the 44px mobile guideline. Bump to `min-h-11 min-w-11`.

## Priority 3 — Small usability additions

**3.1 Language switch reachable from anywhere**
The EN/IT toggle lives only in the hero — halfway down a long mobile page you can't switch language without scrolling to the top. Add the toggle to the sticky search bar (mobile) next to the search field.

**3.2 Saved places visible without opening the map**
Favourites currently only live inside the map dialog. Add a slim "Saved places" strip (chips of starred names) above the sections when at least one favourite exists — tapping a chip opens it on the map. Hidden when nothing is saved, so it never adds clutter.

**3.3 Back-to-top on mobile**
The page is long; add a small floating "↑ top" button that appears after scrolling ~2 screens, positioned above the bottom nav.

## Out of scope (kept simple on purpose)
- No section merging/restructuring, no new pages, no accounts or backend.
- Sharing favourites and curated "top picks" — deliberately skipped before, still skipped.

## Technical notes
- Files: `GuideMapDialog.tsx`, `GuideMapCanvas.tsx`, `PlaceCard.tsx`, `GuideSection.tsx`, `App.tsx`, `MobileBottomNav.tsx` (untouched), locale YAMLs (new keys: locationDenied reuse, savedStrip label, backToTop label — EN + IT).
- All colors via existing tokens; tap targets ≥44px; motion stays limited to existing `whileInView` fades plus a subtle card press feedback.

## Verification
- Build + typecheck pass.
- Playwright at 390×844: check map list full text, denied-location hint, card spacing, star tap size, language toggle in sticky bar, saved strip appears after starring, back-to-top appears on scroll.
