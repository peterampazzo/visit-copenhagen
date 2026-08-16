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

## Editing the content via YAML

All copy and every place lives in `src/content/guide.yaml`, structured so you edit one file and both languages update:

```yaml
languages: [en, it]
site:
  title: { en: "...", it: "..." }
  welcome: { en: "...", it: "..." }
sections:
  - id: know
    emoji: "🧯"
    title: { en: "Things to know", it: "Cose da sapere" }
    groups:
      - title: { en: "Public transport", it: "Mezzi pubblici" }
        items:
          - name: { en: "The Metro runs 24/7", it: "La metro funziona H24" }
            note: { en: "...", it: "..." }
            url: "https://..."
```

Adding a place = adding a list item. Adding a section = adding a block. Missing Italian text falls back to English so nothing breaks mid-edit.

## Technical notes

- One route: rewrite `src/routes/index.tsx` (the placeholder home page) with its own SEO head — unique title, description, og/twitter tags.
- YAML is imported at build time via a small Vite YAML loader plugin (or a `yaml` parse of a raw import), typed with a Zod-free lightweight TS type so the page renders it directly. No backend, no database.
- Language state lives in React with the choice persisted to `localStorage`, read after hydration to avoid SSR mismatch; `lang` reflected on the content container.
- Design tokens (colors, radius, fonts) go into `src/styles.css` as semantic tokens — no hardcoded color classes in components.
- Animation with Motion for React (`motion`) plus CSS transitions; all guarded by reduced-motion.
- Components split small: `Hero`, `SectionNav`, `GuideSection`, `PlaceCard`, `LanguageToggle`.
