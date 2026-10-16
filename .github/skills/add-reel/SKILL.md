---
name: add-reel
description: Add an Instagram reel (or post) to the "From the feed" strip — fetch thumbnail, write EN/IT YAML entries, verify build.
---

# Add a reel to the feed strip

Use this when adding a new Instagram reel (or `/p/` photo post) to the "From the
feed" strip rendered by `src/components/guide/ReelsStrip.tsx`.

## Steps

1. Run `pnpm add-reel <instagram-url> <slug>` where `<slug>` is lowercase
   kebab-case (e.g. `frozen-lakes`). The script downloads the cover image,
   centre-crops it to 640x800 into `public/reels/<slug>.jpg`, and prints the
   camelCase key plus ready-to-paste YAML snippets.
2. Paste the snippet under `reels.items` in `src/locales/en/guide.yaml` at the
   position where the reel should appear — order in the file is order in the
   strip.
3. Replace the draft `caption` with a real one in the voice of the existing
   captions: short (4–9 words), present tense, no hashtags or emoji
   (e.g. "Yes, Denmark has surf").
4. Paste the same entry — identical key, `creator`, `image` and `url` — into
   `src/locales/it/guide.yaml`, with the caption translated into Italian
   (e.g. "Sì, in Danimarca si fa surf").
5. Run `pnpm build` to verify. Optionally `pnpm dev` and scroll to the strip.

## Rules

- The key must be identical in both locale files; English is the fallback.
- `creator` is the Instagram handle, quoted and prefixed with `@`.
- `image` is `/reels/<slug>.jpg`; thumbnails are committed JPEGs, exactly
  640x800, kept under ~170 KB. The component falls back to a coloured tile if
  the image is missing.
- `/p/` photo posts work too — the script accepts both `/reel/` and `/p/` URLs.
- Re-run the script with `--force` to replace an existing thumbnail.

A reel can also be linked from a place card via `media.url` (see the
`frozenLakes` item, ~line 786 in `src/locales/en/guide.yaml`).
