import fs from "node:fs";
import path from "node:path";
import type { Page } from "./types";
import manifest from "@/data/manifest.json";
import departmentsData from "@/data/departments.json";
import categoriesData from "@/data/categories.json";

const PAGES_DIR = path.join(process.cwd(), "src", "data", "pages");
const cache = new Map<string, Page>();

export function getAllSlugs(): string[] {
  return (manifest as { slugs: string[] }).slugs;
}

export function getPage(slug: string): Page | null {
  if (cache.has(slug)) return cache.get(slug)!;
  const file = path.join(PAGES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const page = JSON.parse(fs.readFileSync(file, "utf8")) as Page;
  page.slug = slug;
  cache.set(slug, page);
  return page;
}

export function getAllPages(): Page[] {
  return getAllSlugs()
    .map((s) => getPage(s))
    .filter((p): p is Page => p !== null);
}

export function getPagesByCategory(category: string): Page[] {
  return getAllPages().filter((p) => p.category === category && p.type !== "category");
}

export const TYPE_LABEL: Record<string, string> = {
  department: "Department",
  category: "Category",
  roundup: "Best of",
  review: "Review",
  comparison: "Comparison",
  "buying-guide": "Buying guide",
  howto: "How-to",
  troubleshoot: "Troubleshooting",
  page: "About",
};


export type Department = { slug: string; title: string; short: string; icon: string; blurb: string };
export type CategoryMeta = { slug: string; title: string; department: string; icon: string; blurb: string; count: number };

export const departments = departmentsData as Department[];
export const categories = categoriesData as CategoryMeta[];

export function getDepartment(slug?: string) {
  return departments.find((d) => d.slug === slug) ?? null;
}

export function getCategoryMeta(slug?: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export function getCategoriesByDepartment(dept: string) {
  return categories.filter((c) => c.department === dept);
}

// Department of any page: departments are themselves; categories look up categories.json; articles go through their category.
export function departmentOf(page: Page) {
  if (page.type === "department") return getDepartment(page.slug);
  if (page.type === "category") return getDepartment(getCategoryMeta(page.slug)?.department);
  return getDepartment(getCategoryMeta(page.category)?.department);
}
