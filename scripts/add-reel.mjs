// Adds an Instagram reel (or post) to the "From the feed" strip.
// Fetches the cover image, crops it to 640x800 into public/reels/<slug>.jpg,
// and prints ready-to-paste YAML snippets for both locale files.
// Usage: node scripts/add-reel.mjs <instagram-url> <slug> [--force]
import { existsSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const [url, slug] = args.filter((a) => a !== "--force");

if (!url || !slug) {
  fail("usage: node scripts/add-reel.mjs <instagram-url> <slug> [--force]");
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  fail(`slug "${slug}" must match /^[a-z0-9-]+$/`);
}
const shortcode = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/)?.[1];
if (!shortcode) {
  fail(`could not extract a shortcode from "${url}" (expected /reel/<code>/ or /p/<code>/)`);
}
const kind = url.includes("/p/") ? "p" : "reel";
const canonicalUrl = `https://www.instagram.com/${kind}/${shortcode}/`;

const outPath = `public/reels/${slug}.jpg`;
if (existsSync(outPath) && !force) {
  fail(`${outPath} already exists (use --force to overwrite)`);
}

// oEmbed gives us the author handle, the caption text and a thumbnail.
let handle = null;
let caption = null;
let thumbnailUrl = null;
try {
  const res = await fetch(`https://www.instagram.com/api/v1/oembed/?url=${canonicalUrl}`);
  if (res.ok) {
    const data = await res.json();
    handle = data.author_name ?? null;
    caption = data.title ?? null;
    thumbnailUrl = data.thumbnail_url ?? null;
  }
} catch {
  // fall through — the embed page also carries the username
}

// The embed page carries the full-res cover image.
const embedRes = await fetch(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
  headers: { "User-Agent": UA },
});
if (!embedRes.ok) fail(`embed page returned HTTP ${embedRes.status}`);
const html = await embedRes.text();

if (!handle) {
  handle = html.match(/class="CaptionUsername"[^>]*>([^<]+)</)?.[1]?.trim() ?? null;
}
const imageUrl =
  html.match(/<img class="EmbeddedMediaImage"[^>]*src="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&") ??
  thumbnailUrl;
if (!imageUrl) fail("could not find a cover image (embed page and oEmbed both failed)");

const imageRes = await fetch(imageUrl, { headers: { "User-Agent": UA } });
if (!imageRes.ok) fail(`cover image download returned HTTP ${imageRes.status}`);
const tmpPath = join(tmpdir(), `reel-${slug}.jpg`);
writeFileSync(tmpPath, Buffer.from(await imageRes.arrayBuffer()));

// Crop to exactly 640x800 with sips (macOS).
try {
  execFileSync("sips", ["-g", "pixelWidth", tmpPath], { stdio: "pipe" });
} catch {
  fail(
    "sips is not available — resize the downloaded cover to 640x800 (centre crop) " +
      `and save it as ${outPath} manually. Temp file: ${tmpPath}`,
  );
}
const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", tmpPath], {
  encoding: "utf8",
});
const srcW = Number(dims.match(/pixelWidth: (\d+)/)?.[1]);
const srcH = Number(dims.match(/pixelHeight: (\d+)/)?.[1]);
if (!srcW || !srcH) fail(`could not read image dimensions:\n${dims}`);

// Resample so the smaller dimension fills the 640x800 frame, then centre-crop.
const scale = Math.max(640 / srcW, 800 / srcH);
const newW = Math.round(srcW * scale);
const newH = Math.round(srcH * scale);
execFileSync("sips", ["--resampleWidth", String(newW), "--resampleHeight", String(newH), tmpPath]);
execFileSync("sips", ["-c", "800", "640", tmpPath, "--out", outPath]);

const check = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", outPath], {
  encoding: "utf8",
});
const outW = check.match(/pixelWidth: (\d+)/)?.[1];
const outH = check.match(/pixelHeight: (\d+)/)?.[1];
if (outW !== "640" || outH !== "800") fail(`output is ${outW}x${outH}, expected 640x800`);

const key = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const draftCaption = caption
  ? `TODO — ${caption.replace(/\s+/g, " ").trim().slice(0, 80)}`
  : "TODO — write caption";

console.log(`\nSaved ${outPath} (640x800).`);
console.log(`\nKey: ${key}`);
console.log("\nPaste into src/locales/en/guide.yaml under reels.items:");
console.log(`    ${key}:`);
console.log(`      caption: ${draftCaption}`);
console.log(`      creator: "@${handle ?? "TODO"}"`);
console.log(`      image: /reels/${slug}.jpg`);
console.log(`      url: ${canonicalUrl}`);
console.log("\nPaste into src/locales/it/guide.yaml under reels.items (translate the caption):");
console.log(`    ${key}:`);
console.log(`      caption: TODO — Italian translation`);
console.log(`      creator: "@${handle ?? "TODO"}"`);
console.log(`      image: /reels/${slug}.jpg`);
console.log(`      url: ${canonicalUrl}`);
console.log("\nReminder: add the entry to BOTH locale files with the same key;");
console.log("the order in the file is the order in the strip. Then run: pnpm build");
