# Beyond Copenhagen + mobile UX upgrade

## 1. New content

**LEGO Store, Copenhagen** — added to the guide (Vesterbrogade, by Rådhuspladsen) with a short note and a pin, plus the LEGO House connection mentioned in the story text.

**New section: "Beyond Copenhagen"** (🚆), placed after Saunas, with three groups:

- **Easy day trips (train, under ~1h)** — castles north of the city (Frederiksborg in Hillerød, Kronborg in Helsingør, Frederiksborg's baroque gardens), Louisiana, Roskilde (cathedral + Viking ships), Malmö.
- **Worth the longer ride** — Odense (H.C. Andersen's house), Møns Klint (white chalk cliffs), Stevns Klint.
- **Jutland & further** — Billund / LEGO House, Aarhus (ARoS rainbow panorama), Skagen and Grenen where two seas meet, Rubjerg Knude lighthouse.

Each entry gets a note, a coordinate pin, and where it earns it a short "story" with a source link (same pattern as the existing story cards). Existing `places > trips` entries move into the new section so nothing is duplicated. All content added to both `en` and `it` YAML files with mirrored keys.

## 2. Map improvements

- **City / All of Denmark toggle** in the map header. "City" fits the Copenhagen pins (current behaviour); "All of Denmark" fits every pin including Jutland. Selecting a far-away place auto-switches to the wider view.
- **Search field** above the place list: filters pins and list live by name and note, combined with the section chips.
- **Mobile bottom-sheet layout**: on phones the map fills the screen and the place list becomes a draggable sheet with three snap points (peek / half / full), so the map is never squeezed into a small strip. Selecting a pin snaps the sheet to peek and shows that place's card on top. Desktop keeps the current side-by-side layout.
- Pins for out-of-town places get a subtle distinct treatment (muted ring) so it's obvious they're not a walk away.

## 3. Guide UX improvements

- **Sticky bottom nav on mobile**: thumb-reachable bar with section jump, map button, and favourites, replacing the top scroll-spy nav on small screens (top nav stays on desktop).
- **Favourites**: a star on every place card and map list row, stored on the device (localStorage, per-place id). A "My list" filter chip in the map and a counter in the bottom nav. No account needed.
- Distance/travel-time badges on the Beyond Copenhagen cards (e.g. "40 min by train") so people can plan quickly.

## Technical notes

- Content stays YAML-driven: new keys in `src/locales/{en,it}/guide.yaml`, new `beyond` entry in `GUIDE_ORDER` in `src/lib/guide-content.ts`, new coordinates in `src/data/locations.yaml`. Optional `travel` field added to the item type for the travel-time badge.
- `GuideMapDialog` gains search state, a view-scope toggle, and a mobile sheet; `GuideMapCanvas` takes a `fitScope` prop ("city" | "all") replacing the hard-coded Copenhagen bounding-box heuristic, and a `far` flag on markers.
- Favourites live in a small `useFavourites` hook backed by localStorage, consumed by `PlaceCard`, the map list, and the new bottom nav.
- No backend needed; everything remains static and client-side.
