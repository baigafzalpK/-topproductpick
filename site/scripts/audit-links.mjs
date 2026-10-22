// Checks related links and category references point at real pages, and reports orphan pages.
import fs from "node:fs";
import path from "node:path";

const PAGES = path.join(process.cwd(), "src", "data", "pages");
const pages = fs.readdirSync(PAGES).filter((f) => f.endsWith(".json")).map((f) => ({ slug: f.slice(0, -5), ...JSON.parse(fs.readFileSync(path.join(PAGES, f), "utf8")) }));
const slugs = new Set(pages.map((p) => p.slug));
const linked = new Set();
const problems = [];

for (const p of pages) {
  for (const r of p.related ?? []) {
    if (!slugs.has(r)) problems.push(`${p.slug}: related link to missing page "${r}"`);
    linked.add(r);
  }
  if (p.category) {
    if (!slugs.has(p.category)) problems.push(`${p.slug}: category "${p.category}" does not exist`);
    linked.add(p.slug);
  }
}
const nav = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "categories.json"), "utf8"));
nav.forEach((c) => linked.add(c.slug));
JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "departments.json"), "utf8")).forEach((d) => {
  linked.add(d.slug);
  if (!slugs.has(d.slug)) problems.push(`department "${d.slug}" has no page`);
});
nav.forEach((c) => { if (!slugs.has(c.department) && c.department) problems.push(`category "${c.slug}" uses unknown department "${c.department}"`); });

const orphans = pages.filter((p) => p.type !== "page" && !linked.has(p.slug)).map((p) => p.slug);
if (orphans.length) problems.push(`orphans (nothing links to them): ${orphans.join(", ")}`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`audit-links: ${pages.length} pages, no problems`);
