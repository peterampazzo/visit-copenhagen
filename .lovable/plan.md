# Map review: mobile usability pass

Tested the map dialog at 390x844 (phone). What's wrong today:

- The header + search + filter chips eat 192px before the map starts, and the chip row is cut off mid-chip.
- In the city centre the pins pile on top of each other — around ten overlapping markers near Indre By/Christianshavn, impossible to tap the right one.
- The selected place's popup opens as a large card that covers a third of the map, and the map only recenters on the pin, so the popup often sits half off-screen.
- The places list is a plain show/hide panel, not the promised draggable sheet; while hidden it still holds 75 focusable buttons and links, so screen readers and tab order can reach invisible content.
- Search field text is 14px, which makes iOS Safari zoom the whole page when it's focused.
- No way to see where you are relative to the pins.

## What I'll change

**1. Reclaim vertical space**
Collapse the mobile header into one compact row: title, close button, and a single search/filter trigger. Filter chips move into the list sheet header (still one horizontal row, scroll-snapped so chips never get cut mid-label). Result: map starts around 70px instead of 192px. Desktop layout stays as it is.

**2. Group overlapping pins**
Cluster nearby markers at low zoom into a single count bubble; tapping it zooms into that group. Once zoomed in, individual emoji pins reappear. This fixes the tap-accuracy problem in the centre.

**3. Replace popups with a bottom place card**
Tapping a pin no longer opens a floating popup. Instead the sheet snaps to "peek" and shows a single card for that place: name, note, travel badge, star, and Google Maps button. The map pans with bottom padding so the selected pin stays visible above the card. Swipe left/right on the card moves to the next/previous visible place.

**4. Real draggable sheet**
Three snap points (peek ≈ 25%, half, full) with drag on the grab handle, plus taps on the handle to cycle. When collapsed the sheet is fully removed from the accessibility tree and its contents unmounted, so nothing hidden stays tabbable.

**5. Small fixes**
- Search input at 16px so iOS doesn't zoom.
- "Locate me" button (browser geolocation, dot on map, no data stored) next to the zoom controls; silently hidden if permission is denied.
- Bigger marker hit area (44px touch target while keeping the current pin size).
- Scope toggle shrinks to "City / Denmark" on narrow screens.
- Bottom controls respect safe-area insets so they clear the iPhone home bar.

## Technical notes

- `GuideMapCanvas` moves markers into a GeoJSON source with MapLibre's built-in `cluster: true` for the pin layer, keeping the current emoji DOM markers only for unclustered points at higher zoom; adds a `bottomPadding` prop used in `fitBounds`/`easeTo` and an optional geolocation control.
- New `MapPlaceSheet` component holds the snap-point logic (pointer events + transform, no new dependency) and renders both the selected-place card and the filtered list.
- `GuideMapDialog` keeps ownership of query/scope/section/favourites state; popup code and `mobileList` boolean are replaced by a `snap` state (`peek | half | full`).
- New locale keys in `en`/`it` guide.yaml for the locate button, sheet handle label, and shortened scope labels.
- No backend or content changes; existing desktop side-by-side layout untouched.
