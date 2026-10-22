// Marks products whose Amazon image (images/P/<ASIN>) doesn't exist, so the site shows a fallback
// instead of a blank image. Amazon serves a 43-byte placeholder GIF for missing images.
// Usage: node scripts/check-images.mjs
import fs from "node:fs";
import path from "node:path";

const PAGES = path.join(process.cwd(), "src", "data", "pages");
const files = fs.readdirSync(PAGES).filter((f) => f.endsWith(".json"));
const productsOf = (p) => [...(p.data.products ?? []), p.data.product, p.data.productA, p.data.productB].filter(Boolean);

const asins = new Set();
for (const f of files) for (const x of productsOf(JSON.parse(fs.readFileSync(path.join(PAGES, f), "utf8")))) if (x.asin && !x.image) asins.add(x.asin);

const missing = new Set();
const queue = [...asins];
async function worker() {
  while (queue.length) {
    const asin = queue.shift();
    try {
      const res = await fetch(`https://m.media-amazon.com/images/P/${asin}.01._SL75_.jpg`);
      const size = (await res.arrayBuffer()).byteLength;
      if (!res.ok || size < 200) missing.add(asin);
    } catch {
      // Network errors are not proof the image is missing; leave the product as is.
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

let changed = 0;
for (const f of files) {
  const file = path.join(PAGES, f);
  const page = JSON.parse(fs.readFileSync(file, "utf8"));
  let dirty = false;
  for (const x of productsOf(page)) {
    if (!x.asin) continue;
    const want = missing.has(x.asin);
    if (Boolean(x.noImage) !== want) {
      if (want) x.noImage = true;
      else delete x.noImage;
      dirty = true;
    }
  }
  if (dirty) {
    fs.writeFileSync(file, JSON.stringify(page, null, 2) + "\n");
    changed++;
  }
}
console.log(`checked ${asins.size} ASINs, ${missing.size} without an image, updated ${changed} pages`);
