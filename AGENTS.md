## UI animation

- Animate the language indicator locally inside fixed-size options rather than shared page-layout coordinates, so sticky positioning and translated content cannot displace it.
- Place-card markers: must-see is a rotated outline stamp in the card's reserved top band (next to the save star); indoor is an inline chip at the start of the kicker row. Neither lives in a content row, so tagging a card never moves its title.

## Content

- Adding Instagram reels to the feed strip: follow `.github/skills/add-reel/SKILL.md` (`pnpm add-reel <url> <slug>`).
