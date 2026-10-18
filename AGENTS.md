## UI animation

- Animate the language indicator locally inside fixed-size options rather than shared page-layout coordinates, so sticky positioning and translated content cannot displace it.
- Place-card markers: must-see / indoor are labelled tags (icon + text, same glyphs as the filter pills) hanging from the card's top border, which is recoloured to match (coral for must-see, harbour for indoor-only). They live in a reserved top band present on every card, so tagging a card never moves its title.

## Content

- Adding Instagram reels to the feed strip: follow `.github/skills/add-reel/SKILL.md` (`pnpm add-reel <url> <slug>`).
