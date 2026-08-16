# A København sono tutti matti — a guide for visiting friends

A single-page, mobile-first Copenhagen guide for your visitors, in English and Italian, with playful animation and all content living in one easily editable YAML file. No housing, keys, Wi-Fi, or personal logistics included.

## Look and feel

- Palette: Nyhavn facades — warm cream background `#fff8ea`, mustard `#e8a33d`, Nyhavn red `#d94f3d`, harbour teal `#2f6f6b`, deep ink text.
- Type: Outfit for headings, Figtree for body (loaded via a font `<link>` in the root route).
- Playful but tidy (energy 4/5): colorful section bands, chunky rounded cards, emoji section markers straight from your notes, generous mobile tap targets.
- Animation: hero title reveal, scroll-reveal for cards, animated language toggle, tappable card hover/press states, a subtle bobbing element in the hero. Motion stays snappy and respects `prefers-reduced-motion`.

## Structure (one scrolling page, mobile-first)

1. **Hero** — title "A København sono tutti matti", a short generic welcome from you, language toggle (EN / IT) pinned top-right.
2. **Sticky section nav** — chips that scroll to each section, plus current-section highlight.
3. **Things to know 🧯** — transport (metro 24/7, paper tickets need no validation, City Pass Small, Copenhagen Card, Citymapper for waterbus), cycling rules with the police PDF link, bottle/can deposit returns, payments (kroner, near-cashless, cards everywhere).
4. **Places & things 🏰** — grouped as Classics & Parks, Neighborhoods, Modern & Views, Trips. Each item is a card with name, short note, optional link.
5. **Food 😋** — markets (Torvehallerne, Reffen, Broens Gadekøkken, Kødbyen), dining (Det Lille Apotek, Aamanns 1921), plus the smørrebrød note.
6. **Pastries 🍰** — Andersen, Juno, Lagkagehuset, plus the Instagram link.
7. **Museums 🏺** — SMK, Nationalmuseet, Thorvaldsens, Glyptotek, Cisternerne, Experimentarium, Louisiana (~1h train), VisitCopenhagen link.
8. **Saunas 🧖** — Glaecier, Sauna85, Plugin Heat Club, Platform CPH.
9. **Inspiration 👻** — the NYT "Things to do in Copenhagen" piece.
10. **Footer** — a short sign-off line.

Every item that has a map or website link gets a tappable link button. Items keep their little honest asides ("nothing fancy", "Pusher Street is closed") since that's the charm of your notes.

## Editing the content (standard i18n)

Content uses the standard i18next setup: one locale file per language, same key structure in each, so it works with any translation tool or editor.

- `src/locales/en/guide.yaml`
- `src/locales/it/guide.yaml`

```yaml
site:
  title: A København sono tutti matti
  welcome: Welcome to Copenhagen...
sections:
  know:
    emoji: "🧯"
    title: Things to know
    groups:
      transport:
        title: Public transport
        items:
          metro:
            name: The Metro runs 24/7
            note: Paper tickets don't need validating.
            url: https://...
```

The Italian file mirrors the same keys with Italian values. Rendering order comes from a small ordered key list per section, so adding a place = adding a key in both locale files (English is the fallback language, so an untranslated key still renders instead of breaking).


## Technical notes

- One route: rewrite `src/routes/index.tsx` (the placeholder home page) with its own SEO head — unique title, description, og/twitter tags.
- YAML locale files are loaded at build time (Vite YAML import) and registered as i18next resource bundles — no runtime HTTP fetching, so SSR renders the right language immediately.
- i18n via `i18next` + `react-i18next`: `fallbackLng: "en"`, namespace `guide`, `returnObjects: true` for lists. Language choice persisted in `localStorage` and applied after hydration to avoid SSR mismatch; `lang` attribute kept in sync.

- Design tokens (colors, radius, fonts) go into `src/styles.css` as semantic tokens — no hardcoded color classes in components.
- Animation with Motion for React (`motion`) plus CSS transitions; all guarded by reduced-motion.
- Components split small: `Hero`, `SectionNav`, `GuideSection`, `PlaceCard`, `LanguageToggle`.
