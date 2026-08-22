Plan: main-page search + distance-aware map list

Based on your choices, we will add two focused improvements that keep the app simple, mobile-first, and immediately useful for friends wandering around Copenhagen.

1. Main-page search

A sticky, rounded search bar near the top of the page that filters every place card in real time across all sections.

- Add a new `SearchBar` component (`src/components/guide/SearchBar.tsx`) with a 16px font (to avoid iOS zoom), clear button, and accessible label.
- Store the search query in `App.tsx` and pass it down to each `GuideSection`.
- In `GuideSection`, only render groups that contain matching items, and only render items whose name, note, kicker, or group title match the query.
- Sections with no matches collapse automatically. When nothing matches anywhere, show a friendly empty state in the current language.
- The search bar stays reachable on mobile while scrolling; on desktop it can sit inline in the hero area.
- Add new locale keys: `searchLabel`, `searchPlaceholder`, `searchClear`, `searchNoResults`.

2. Distance-aware map list

When the user grants location permission, the map list shows how far each place is and can sort by nearest first.

- Add a small distance utility (`src/lib/distance.ts`) using the Haversine formula to compute meters/km between the user's location and each place coordinate.
- In `GuideMapDialog`, request the browser geolocation when the map opens. If granted, compute distances for all visible places and expose them as a `distance` field on `GuideMapPlace`.
- Add a toggle chip in the map sheet header: "Near me" / "Default". "Near me" sorts by distance ascending; "Default" keeps the existing section order.
- Show a distance badge on each list card (e.g., "450 m" or "2.3 km"), and a rough walking time for nearby spots. Also show it in the selected-place card.
- If permission is denied or unavailable, fall back gracefully to the current order without error UI.
- Add new locale keys: `distanceUnitM`, `distanceUnitKm`, `sortDefault`, `sortNearMe`, `locationDenied`.

Out of scope (to keep it simple)

- No sharing of favourites for now.
- No curated top-picks strip.
- No routing/directions inside the app — Google Maps links remain the primary way to get directions.

Expected result

Friends can open the app, type "sauna" or "lego", and instantly see relevant cards. On the map, after allowing location, they can sort by what's closest and see distances at a glance.
