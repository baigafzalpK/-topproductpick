// Adds Amazon image links by hand for products whose image can't be found automatically
// (marked "noImage" by check-images.mjs). Uses missing_images.csv in the site folder with
// the columns: product_id, product_name, amazon_url, image_url
//
//   node scripts/missing-images.mjs export   Write missing_images.csv (one row per product, image_url blank).
//                                            Refuses to overwrite a file that already has image links.
//   node scripts/missing-images.mjs check    Read the CSV and validate every filled image_url.
//                                            Read-only: never changes product data.
//   node scripts/missing-images.mjs apply    Validate, then save each valid link as the product's image
//                                            on every page that lists it. Never removes products.
//
// To fill the CSV: open each amazon_url, right-click the main photo, choose "Copy image address",
// and paste it into image_url. Leave a row blank to skip it.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGES = path.join(ROOT, "src", "data", "pages");
const CSV = path.join(ROOT, "missing_images.csv");
const COLUMNS = ["product_id", "product_name", "amazon_url", "image_url"];
// Amazon's own image servers, e.g. https://m.media-amazon.com/images/I/71abc.jpg
const IMAGE_HOST = /(^|\.)media-amazon\.com$|(^|\.)ssl-images-amazon\.com$/;
const ASIN = /^[A-Z0-9]{10}$/;

const files = fs.readdirSync(PAGES).filter((f) => f.endsWith(".json"));
const productsOf = (p) => [...(p.data.products ?? []), p.data.product, p.data.productA, p.data.productB].filter(Boolean);
const csvCell = (s) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) rows.push([...row, cell]);
  return rows.filter((r) => r.some((c) => c.trim()));
}

// Every product on the site, keyed by ASIN.
function loadProducts() {
  const byId = new Map();
  for (const f of files) {
    for (const x of productsOf(JSON.parse(fs.readFileSync(path.join(PAGES, f), "utf8")))) {
      if (x.asin && !byId.has(x.asin)) byId.set(x.asin, x);
    }
  }
  return byId;
}

function readCsv() {
  if (!fs.existsSync(CSV)) {
    console.error(`${path.basename(CSV)} not found in ${ROOT}. Run "export" first.`);
    process.exit(1);
  }
  const [header = [], ...rows] = parseCsv(fs.readFileSync(CSV, "utf8").replace(/^﻿/, ""));
  const names = header.map((h) => h.trim());
  const missing = COLUMNS.filter((c) => !names.includes(c));
  if (missing.length) {
    console.error(`${path.basename(CSV)} is missing column(s): ${missing.join(", ")}. Expected: ${COLUMNS.join(", ")}`);
    process.exit(1);
  }
  const idx = Object.fromEntries(COLUMNS.map((c) => [c, names.indexOf(c)]));
  // Line numbers match what a spreadsheet shows (header is line 1).
  return rows.map((r, i) => ({
    line: i + 2,
    ...Object.fromEntries(COLUMNS.map((c) => [c, (r[idx[c]] ?? "").trim()])),
  }));
}

async function loadsImage(url) {
  const res = await fetch(url);
  const type = res.headers.get("content-type") ?? "";
  const size = (await res.arrayBuffer()).byteLength;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!type.startsWith("image/")) throw new Error(`not an image (${type || "no content type"})`);
  // Amazon answers missing images with a 43-byte placeholder.
  if (size < 200) throw new Error("empty placeholder image");
}

// Returns the valid { product_id -> image_url } pairs and prints a report.
async function validate() {
  const rows = readCsv();
  const products = loadProducts();
  const filled = rows.filter((r) => r.image_url);
  const valid = new Map();
  const problems = [];
  const seen = new Set();

  for (const r of filled) {
    const where = `line ${r.line} (${r.product_id || "no product_id"})`;
    if (!r.product_id) {
      problems.push(`${where}: product_id is empty`);
      continue;
    }
    if (!ASIN.test(r.product_id)) {
      problems.push(`${where}: product_id is not a 10-character ASIN`);
      continue;
    }
    if (!products.has(r.product_id)) {
      problems.push(`${where}: no product with this ASIN on the site`);
      continue;
    }
    if (seen.has(r.product_id)) {
      problems.push(`${where}: product_id appears more than once; using the first link`);
      continue;
    }
    seen.add(r.product_id);
    let url;
    try {
      url = new URL(r.image_url);
    } catch {
      problems.push(`${where}: image_url is not a valid link`);
      continue;
    }
    if (url.protocol !== "https:") {
      problems.push(`${where}: image_url must start with https://`);
      continue;
    }
    if (!IMAGE_HOST.test(url.hostname)) {
      problems.push(`${where}: image_url must be on Amazon's image server (m.media-amazon.com), got ${url.hostname}`);
      continue;
    }
    try {
      await loadsImage(url.href);
      valid.set(r.product_id, url.href);
    } catch (e) {
      problems.push(`${where}: image_url doesn't load an image (${e.message})`);
    }
  }

  console.log(`${path.basename(CSV)}: ${rows.length} rows, ${filled.length} with image_url, ${rows.length - filled.length} blank (skipped)`);
  console.log(`valid: ${valid.size}, problems: ${problems.length}`);
  for (const p of problems) console.log(`  - ${p}`);
  return valid;
}

function exportCsv() {
  if (fs.existsSync(CSV) && readCsv().some((r) => r.image_url)) {
    console.error(`${path.basename(CSV)} already has image links. Not overwriting; rename or move it first.`);
    process.exit(1);
  }
  const seen = new Map();
  for (const f of files) {
    for (const x of productsOf(JSON.parse(fs.readFileSync(path.join(PAGES, f), "utf8")))) {
      if (x.asin && x.noImage && !x.image && !seen.has(x.asin)) seen.set(x.asin, x.name);
    }
  }
  const lines = [COLUMNS.join(",")];
  for (const [asin, name] of seen) lines.push([asin, csvCell(name), `https://www.amazon.com/dp/${asin}`, ""].join(","));
  fs.writeFileSync(CSV, lines.join("\r\n") + "\r\n");
  console.log(`wrote ${seen.size} products to ${path.relative(ROOT, CSV)}`);
}

async function apply() {
  const images = await validate();
  if (!images.size) {
    console.log("nothing to apply");
    return;
  }
  let updated = 0;
  for (const f of files) {
    const file = path.join(PAGES, f);
    const page = JSON.parse(fs.readFileSync(file, "utf8"));
    let dirty = false;
    for (const x of productsOf(page)) {
      const url = x.asin && images.get(x.asin);
      if (url && x.image !== url) {
        x.image = url;
        delete x.noImage;
        dirty = true;
      }
    }
    if (dirty) {
      fs.writeFileSync(file, JSON.stringify(page, null, 2) + "\n");
      updated++;
    }
  }
  console.log(`added ${images.size} images across ${updated} pages`);
}

const cmd = process.argv[2];
if (cmd === "export") exportCsv();
else if (cmd === "check") await validate();
else if (cmd === "apply") await apply();
else console.log("usage: node scripts/missing-images.mjs export | check | apply");
