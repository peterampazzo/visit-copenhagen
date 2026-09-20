// Generates LLM-friendly markdown from the guide YAML locale files.
// Outputs: public/guide.en.md, public/guide.it.md, public/llms.txt
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";

const SITE_URL = "https://hygge.peterampazzo.com";

function renderLinks(item) {
  const links = [];
  if (item.url) links.push(item.linkText ? `[${item.linkText}](${item.url})` : item.url);
  if (item.links) {
    for (const link of Object.values(item.links)) {
      links.push(`[${link.text}](${link.url})`);
    }
  }
  return links.length ? ` · ${links.join(" · ")}` : "";
}

function renderItem(item) {
  const lines = [];
  const note = item.note ? ` — ${item.note}` : "";
  const travel = item.travel ? ` _(${item.travel})_` : "";
  lines.push(`- **${item.name}**${note}${travel}${renderLinks(item)}`);
  if (item.kicker) lines.push(`  - _${item.kicker}_`);
  if (item.story) lines.push(`  - ${item.story.replace(/\s+/g, " ").trim()}`);
  if (item.storyItems) {
    for (const s of item.storyItems) lines.push(`  - ${s}`);
  }
  if (item.tips) {
    for (const tip of item.tips) lines.push(`  - Tip: ${tip}`);
  }
  return lines;
}

function renderGuide(data, lang) {
  const site = data.site;
  const out = [];
  out.push(`# ${site.title}`);
  out.push("");
  out.push(`> ${site.description}`);
  out.push("");
  out.push(`${site.authorBy} · ${site.aiAssisted}`);
  out.push(`Language: ${lang === "it" ? "Italian" : "English"} · Source: ${SITE_URL}`);
  out.push("");

  for (const section of Object.values(data.sections ?? {})) {
    out.push(`## ${section.emoji ? `${section.emoji} ` : ""}${section.title}`);
    if (section.blurb) out.push(`_${section.blurb}_`);
    out.push("");
    for (const group of Object.values(section.groups ?? {})) {
      out.push(`### ${group.title}`);
      if (group.route) {
        out.push(`Route: ${group.route.label} — ${group.route.stops.join(" → ")}`);
      }
      for (const item of Object.values(group.items ?? {})) {
        out.push(...renderItem(item));
      }
      out.push("");
    }
  }

  if (data.reels?.items && Object.keys(data.reels.items).length > 0) {
    out.push(`## ${data.reels.title}`);
    if (data.reels.blurb) out.push(`_${data.reels.blurb}_`);
    out.push("");
    for (const reel of Object.values(data.reels.items)) {
      out.push(`- ${reel.caption}${reel.url ? ` — ${reel.url}` : ""}`);
    }
    out.push("");
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

const en = parse(readFileSync("src/locales/en/guide.yaml", "utf8"));
const it = parse(readFileSync("src/locales/it/guide.yaml", "utf8"));

writeFileSync("public/guide.en.md", renderGuide(en, "en"));
writeFileSync("public/guide.it.md", renderGuide(it, "it"));

const llms = `# ${en.site.title}

> ${en.site.description}

A personal, mobile-friendly Copenhagen guide for visiting friends and family,
written by Pietro (who lives in Copenhagen). Available in English and Italian.
The whole site is a single page; the full guide content is available as markdown.

## Content

- [Full guide (English)](/guide.en.md): All sections — transport, places, food, pastries, museums, saunas, boats, day trips and seasonal events.
- [Guida completa (Italiano)](/guide.it.md): Tutte le sezioni della guida in italiano.

## Pages

- [Guide](/): The single-page guide (English, language toggle to Italian).
`;
writeFileSync("public/llms.txt", llms);

console.log("Generated public/guide.en.md, public/guide.it.md, public/llms.txt");
