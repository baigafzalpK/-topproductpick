// Imports roundups and products extracted from BuyOnceRight (the owner's other site) into src/data.
// Usage: node scripts/import-products.mjs <dir-with-raw-and-groups.json>
// Re-running is safe: imported pages are rewritten, hand-written pages are never touched.
// Remove everything it created with: node scripts/import-products.mjs --remove
import fs from "node:fs";
import path from "node:path";

const DATA = path.join(process.cwd(), "src", "data");
const PAGES = path.join(DATA, "pages");
const TODAY = new Date().toISOString().slice(0, 10);
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const writeJson = (f, v) => fs.writeFileSync(f, JSON.stringify(v, null, 2) + "\n");

// BuyOnceRight category group -> our department slug
const GROUP_TO_DEPT = {
  "Tech & Workspace": "electronics",
  "Kitchen & Dining": "kitchen-and-dining",
  "Home & Living": "home-and-living",
  "Health & Fitness": "health-and-fitness",
  "Outdoor & Garden": "outdoor-and-garden",
  "Workshop & Tools": "tools-and-workshop",
  "Baby & Kids": "baby-and-kids",
  Pets: "pets",
  Travel: "travel",
  "More topics": "more-topics",
};
const DEPT_ICON = {
  electronics: "💻",
  "kitchen-and-dining": "🍳",
  "home-and-living": "🛋️",
  "health-and-fitness": "💪",
  "outdoor-and-garden": "🌿",
  "tools-and-workshop": "🛠️",
  "baby-and-kids": "🧸",
  pets: "🐾",
  travel: "🧳",
  "more-topics": "📦",
};

// Claims we never publish: rating counts, star scores and testing language.
const BANNED = /\b\d[\d,.]*\+?\s*(ratings?|reviews?|stars?)\b|\bstar rating|\bratings volume|\btested\b|\btesting\b|hands-on|our lab|head-to-head/i;
const clean = (list = []) => list.filter((s) => s && !BANNED.test(s));

const pageFiles = () => fs.readdirSync(PAGES).filter((f) => f.endsWith(".json"));

function removeImported() {
  let n = 0;
  for (const f of pageFiles()) {
    const p = readJson(path.join(PAGES, f));
    if (p.imported) {
      fs.rmSync(path.join(PAGES, f));
      n++;
    }
  }
  const cats = readJson(path.join(DATA, "categories.json")).filter((c) => !c.imported);
  writeJson(path.join(DATA, "categories.json"), cats);
  console.log(`removed ${n} imported pages`);
}

if (process.argv[2] === "--remove") {
  removeImported();
  process.exit(0);
}

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/import-products.mjs <dir>  |  --remove");
  process.exit(1);
}

removeImported();

const groups = readJson(path.join(src, "groups.json"));
const catGroup = {};
for (const g of groups) for (const it of g.items) catGroup[it.slug] = g.group;

const existing = new Set(pageFiles().map((f) => f.slice(0, -5)));
const categories = readJson(path.join(DATA, "categories.json"));
const catSlugs = new Set(categories.map((c) => c.slug));

function topicFrom(h1, slug) {
  let t = h1.split(/[:|–—]/)[0].replace(/^the\s+\d+\s+/i, "").replace(/^\d+\s+/, "").replace(/^best\s+/i, "").trim();
  if (!t) t = slug.replace(/^best-/, "").replace(/-/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

let roundups = 0;
let skipped = 0;
const asins = new Set();
for (const f of fs.readdirSync(path.join(src, "raw"))) {
  const raw = readJson(path.join(src, "raw", f));
  if (!raw.category || raw.products.length === 0) {
    skipped++;
    continue;
  }
  const cat = raw.category;
  const dept = GROUP_TO_DEPT[catGroup[cat.slug]] ?? "more-topics";

  if (!catSlugs.has(cat.slug)) {
    categories.push({
      slug: cat.slug,
      title: cat.title,
      department: dept,
      icon: DEPT_ICON[dept],
      blurb: `Best-of lists and buying advice for ${cat.title.toLowerCase()}.`,
      count: 0,
      imported: true,
    });
    catSlugs.add(cat.slug);
  }
  if (!existing.has(cat.slug)) {
    writeJson(path.join(PAGES, `${cat.slug}.json`), {
      type: "category",
      imported: true,
      title: `${cat.title}: Best Picks and Buying Advice`,
      h1: cat.title,
      metaDescription: `Every list we've published on ${cat.title.toLowerCase()}, with strengths and limitations for each product.`,
      lede: `Start with the list that matches your budget or use, then compare the strengths and limitations of each pick.`,
      updatedAt: TODAY,
      data: {},
    });
    existing.add(cat.slug);
  }

  if (existing.has(raw.slug)) {
    skipped++;
    continue;
  }

  const products = raw.products.map((p) => {
    asins.add(p.asin);
    const features = clean(p.features);
    const product = {
      name: p.name,
      brand: p.brand || p.name.split(" ")[0],
      asin: p.asin,
      blurb: features.length ? `Key specs: ${features.slice(0, 3).join(", ")}.` : "",
      strengths: clean(p.strengths),
      limitations: clean(p.limitations),
      features,
    };
    if (p.badge) product.badge = p.badge;
    if (p.bestFor && !/most buyers/i.test(p.bestFor)) product.bestFor = p.bestFor;
    return product;
  });

  const topic = topicFrom(raw.h1, raw.slug);
  const n = products.length;
  writeJson(path.join(PAGES, `${raw.slug}.json`), {
    type: "roundup",
    imported: true,
    title: n === 1 ? `Our Top Pick: ${topic}` : `The ${n} Best ${topic}`,
    h1: n === 1 ? `Our Top Pick: ${topic}` : `The ${n} Best ${topic}`,
    metaDescription: `Our ${n === 1 ? "top pick" : `${n} picks`} for ${topic.toLowerCase()}, with key specs, strengths and limitations for each, based on manufacturer specs, independent reviews and owner reports.`,
    lede: `We looked at ${topic.toLowerCase()} using manufacturer specs, independent reviews and owner reports. Each pick lists what it does well and where it falls short, so you can match it to how you'll use it.`,
    updatedAt: TODAY,
    category: cat.slug,
    related: [cat.slug],
    data: {
      products,
      howWeChose: [
        "Picks are based on manufacturer specs, independent reviews and owner reports. We don't claim our own testing.",
        "We do not list prices or star ratings because they change. Check Amazon for current details.",
      ],
    },
  });
  existing.add(raw.slug);
  roundups++;
}

writeJson(path.join(DATA, "categories.json"), categories);
console.log(`imported ${roundups} roundups, ${asins.size} unique products (ASINs), skipped ${skipped}`);
