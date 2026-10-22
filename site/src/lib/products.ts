// Builds one product hub page per product from every list on the site.
import { getAllPages, getAllSlugs } from "./content";
import { slugify } from "./slug";
import type { Product, ProductHub } from "./types";

let hubs: ProductHub[] | null = null;
let byKey: Map<string, ProductHub> | null = null;
let bySlug: Map<string, ProductHub> | null = null;

function key(p: Product) {
  return p.asin || slugify(p.name);
}

function build() {
  const pages = getAllPages();
  const pageSlugs = new Set(getAllSlugs());
  const map = new Map<string, ProductHub>();
  const reviews = new Map<string, string>();

  const add = (product: Product, list?: { slug: string; title: string; badge?: string }) => {
    const k = key(product);
    let hub = map.get(k);
    if (!hub) {
      hub = { slug: "", product, lists: [] };
      map.set(k, hub);
    }
    if (list && !hub.lists.some((l) => l.slug === list.slug)) hub.lists.push(list);
  };

  for (const page of pages) {
    const ref = { slug: page.slug, title: page.h1 };
    page.data.products?.forEach((p) => add(p, { ...ref, badge: p.badge }));
    if (page.data.productA) add(page.data.productA, ref);
    if (page.data.productB) add(page.data.productB, ref);
    if (page.type === "review" && page.data.product) {
      add(page.data.product);
      reviews.set(key(page.data.product), page.slug);
    }
  }

  const used = new Set(pageSlugs);
  for (const [k, hub] of map) {
    const base = slugify(hub.product.name);
    const reviewSlug = reviews.get(k);
    // An editorial review owns /<name>-review; the hub moves to /<name>.
    let slug = reviewSlug ? base : `${base}-review`;
    if (used.has(slug)) slug = `${base}-overview`;
    // Two different products can share a name (e.g. color variants): add the ASIN.
    if (used.has(slug)) slug = `${base}-${k.toLowerCase()}`;
    hub.reviewSlug = reviewSlug;
    hub.slug = slug;
    used.add(slug);
  }

  hubs = [...map.values()];
  byKey = map;
  bySlug = new Map(hubs.map((h) => [h.slug, h]));
}

export function getProductHubs(): ProductHub[] {
  if (!hubs) build();
  return hubs!;
}

export function getProductHub(slug: string) {
  if (!bySlug) build();
  return bySlug!.get(slug) ?? null;
}

export function hubSlugFor(product: Product) {
  if (!byKey) build();
  return byKey!.get(key(product))?.slug ?? null;
}
