# Richer stories + a reels strip

Two small additions layered on top of the guide as it is now. Nothing moves, nothing is replaced — existing content keeps working untouched.

## 1. Richer "the story" popups

The story popup today shows a title, a note, the story text or bullet list, and at most one link. Three optional extras get added, each shown only when you fill it in:

- **A photo or reel preview** at the top of the popup — a picture, or a reel thumbnail with a play badge that opens the reel on Instagram.
- **A "good to know" list** — a couple of short practical tips (best time to go, how to get there, what to skip), styled as a compact tinted box so it reads differently from the story itself.
- **Several named links** instead of one — official site, Wikipedia, an article, tickets. Each gets its own small pill; the Instagram ones get the Instagram mark, as elsewhere.

Existing single-link stories keep behaving exactly as now.

## 2. Reels strip near the bottom

A new short section just before the footer: a swipeable horizontal row of tall reel/photo cards (portrait shaped, like a phone screen), each with a thumbnail, a small caption, and a play badge. Tapping one opens it on Instagram in a new tab — no Instagram embeds or scripts, so the page stays fast on phones.

- Scrolls sideways with the finger on phones, snapping card to card; on a wide screen it becomes a normal row.
- Cards you add for pictures (no reel) simply open the photo link.
- The whole section disappears if the list is empty, so it can start with the one reel you already have and grow later.
- It sits outside the search filter, since it's a bonus strip rather than guide content.

## Filling it in

Everything is added in the same YAML files you already edit, in both English and Italian.

Story extras, per item:

```yaml
tips:
  - Go early, the courtyard is empty before 10.
links:
  official:
    text: Official site
    url: https://...
media:
  image: /reels/nyhavn.jpg      # thumbnail in the public folder
  url: https://www.instagram.com/reel/...
```

Reels strip, in its own block:

```yaml
reels:
  title: From my phone
  blurb: A few clips and pictures from around town.
  items:
    winterbath:
      caption: Winter dip at Islands Brygge
      image: /reels/winterbath.jpg
      url: https://www.instagram.com/reel/DVHRB9PiILm/
```

Thumbnails: Instagram does not allow reliable iframe embeds or hotlinked thumbnails, so each card needs a thumbnail image saved in the project's public folder. A screenshot of the reel is enough. I'll wire a fallback: if a thumbnail is missing, the card shows a coloured tile with the caption instead of breaking.

## Technical notes

- Extend `GuideItem` in `src/lib/guide-content.ts` with optional `tips?: string[]`, `links?: Record<string, {text, url}>` (ordered via `Object.entries`), and `media?: {image?, url?, alt?}`.
- `GuideStoryDialog.tsx`: add a media block above the title area, a tips box after the story, and render `links` as pills in the existing footer row alongside the current `item.url`.
- New `src/components/guide/ReelsStrip.tsx` — `overflow-x-auto snap-x snap-mandatory` row, `aspect-[9/16]` cards, `scrollbar-none` (already in `styles.css`), scroll-reveal via `motion` with reduced-motion respected, lazy-loaded images.
- New `reels` root key in `src/locales/{en,it}/guide.yaml`, read via a typed helper next to `toGuideSections`; rendered in `App.tsx` between the last section and `GuideFooter`, unaffected by the search query.
- No new dependencies, no backend, no Instagram SDK.
