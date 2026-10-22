// Builds the site's logo and icon files from assets/brand/logo-original.jpg (white background).
// Usage: node scripts/make-logo.mjs
// Output: public/images/brand/logo{,-dark}.png (full, with tagline), logo-header{,-dark}.png (no tagline),
//         src/app/icon.png and src/app/apple-icon.png (the cart mark).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "assets", "brand", "logo-original.jpg");
const OUT = path.join(ROOT, "public", "images", "brand");
fs.mkdirSync(OUT, { recursive: true });

// Regions in the 1600x533 source.
const TAGLINE = { left: 505, top: 335, right: 1600, bottom: 405 };
const MARK = { left: 20, top: 20, width: 490, height: 460 };
const WORDMARK_LEFT = 505;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

// "Color to alpha" against white: anti-aliased edges and soft shadows keep their look on any background.
function whiteToAlpha(buf) {
  const out = Buffer.from(buf);
  for (let i = 0; i < out.length; i += 4) {
    const [r, g, b] = [out[i], out[i + 1], out[i + 2]];
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (a < 0.04) {
      out[i + 3] = 0;
      continue;
    }
    out[i] = Math.round((r - 255 * (1 - a)) / a);
    out[i + 1] = Math.round((g - 255 * (1 - a)) / a);
    out[i + 2] = Math.round((b - 255 * (1 - a)) / a);
    out[i + 3] = Math.round(a * 255);
  }
  return out;
}

// Dark-theme variant: the navy wordmark and tagline become light so they stay readable.
// The cart mark keeps its colors (its blues and gradients still read well on dark backgrounds).
function lightenNavy(buf) {
  const out = Buffer.from(buf);
  for (let i = 0; i < out.length; i += 4) {
    if (!out[i + 3] || (i / 4) % width < WORDMARK_LEFT) continue;
    const [r, g, b] = [out[i], out[i + 1], out[i + 2]];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum < 70 && b >= r) {
      out[i] = 235;
      out[i + 1] = 241;
      out[i + 2] = 250;
    }
  }
  return out;
}

function eraseTagline(buf) {
  const out = Buffer.from(buf);
  for (let y = TAGLINE.top; y < TAGLINE.bottom; y++) {
    for (let x = TAGLINE.left; x < Math.min(TAGLINE.right, width); x++) out[(y * width + x) * 4 + 3] = 0;
  }
  return out;
}

const raw = { raw: { width, height, channels: 4 } };
const full = whiteToAlpha(data);
const header = eraseTagline(full);

async function save(buf, file, targetWidth) {
  await sharp(buf, raw).trim({ threshold: 1 }).resize({ width: targetWidth }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(OUT, file));
}

await save(full, "logo.png", 800);
await save(lightenNavy(full), "logo-dark.png", 800);
await save(header, "logo-header.png", 640);
await save(lightenNavy(header), "logo-header-dark.png", 640);

// Square icon from the cart mark, on a transparent background.
// Two steps: sharp would otherwise trim before extracting.
const markArea = await sharp(full, raw).extract(MARK).png().toBuffer();
const mark = await sharp(markArea).trim({ threshold: 1 }).png().toBuffer();
const square = (size) =>
  sharp(mark).resize({ width: size, height: size, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 });
await square(512).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(ROOT, "src", "app", "icon.png"));
// iOS shows apple-touch icons on a solid tile, so give it a white background and some padding.
await sharp(await square(150).toBuffer())
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: "#ffffff" })
  .png()
  .toFile(path.join(ROOT, "src", "app", "apple-icon.png"));

for (const f of fs.readdirSync(OUT)) {
  const m = await sharp(path.join(OUT, f)).metadata();
  console.log(`${f}: ${m.width}x${m.height}, ${Math.round(fs.statSync(path.join(OUT, f)).size / 1024)} KB`);
}
console.log("icon.png, apple-icon.png written to src/app");
