# Map fixes + card polish

## 1. Desktop map centering is offset

Confirmed cause: the map always gets the mobile bottom-sheet padding (`bottomPadding` 190–300px, passed unconditionally at `GuideMapDialog.tsx:333`). On desktop there is no bottom sheet — the list sits beside the map — so every `easeTo`/`fitBounds` pushes the target that far above centre.

Fix: only apply bottom padding below the `lg` breakpoint (track viewport with the existing responsive hook / a `matchMedia` listener, pass `0` on desktop). Both the "fit all pins" and "centre on selected pin" moves then land in the true centre on desktop; mobile behaviour stays exactly as it is today.

## 2. Selected pin is indistinguishable

Today the selected marker turns `--sun` (orange) — the same colour as every cluster bubble, so it disappears in a field of orange (as in the screenshot with Nyhavn selected).

Fix, in `styles.css` + marker rendering:
- Selected pin: coral fill with cream emoji, thicker ink border, larger scale, and a soft coral halo ring — a colour used by nothing else on the map.
- Add a gentle one-shot "drop/pulse" animation when a pin becomes selected so the eye catches it.
- Clusters keep sun but get slightly muted (lower contrast) while a pin is selected, so the selection reads first.
- The selected pin is always rendered as an individual pin (already the case) and is drawn above clusters (`z-index`).
- Matching cue in the list/card: selected row keeps a coral border so map and sheet agree.

## 3. Content cards on mobile

Keep the current structure, tighten the mobile rendering of `PlaceCard`:
- Move the star to a stable top-right slot with the title reserving space for it (no more text wrapping under the button), 44px target kept.
- Title, note, then a single action row that wraps predictably; badges (travel) and pills get consistent height and don't shrink oddly on narrow screens.
- Slightly reduce padding/border radius on small screens, increase note line-height for readability, and allow long names to break instead of overflowing.
- Single-column full-width cards below `sm`, so no cramped two-up layout on phones.

## Additional ideas (my suggestions, included in this pass unless you drop any)

- **Map card back-to-list**: on mobile the peek card gets a clear "See all places" affordance so users don't get stuck in the single-card view.
- **Section colour accents**: each section emoji gets a subtle tinted pin ring so Places / Food / Beyond are distinguishable at a glance on the map.

## Technical notes

- `GuideMapCanvas.tsx`: honour a `bottomPadding` of 0 cleanly; add `data-selected` styling hooks and z-order for the selected marker; keep cluster logic untouched.
- `GuideMapDialog.tsx`: compute `bottomPadding` from a desktop media query instead of always using `BOTTOM_PADDING[snap]`.
- `styles.css`: new selected-marker and cluster-dimming rules using existing tokens (`--coral`, `--sun`, `--ink`, `--cream`).
- `PlaceCard.tsx` / `GuideSection.tsx`: layout-only class changes, no logic or content changes.
- No backend, locale, or data changes beyond one new label for the back-to-list action (EN + IT).
