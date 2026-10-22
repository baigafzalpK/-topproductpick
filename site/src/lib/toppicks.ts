import { categories, getAllPages } from "./content";
import { productImage } from "./affiliate";
import { hubSlugFor } from "./products";
import type { Page, Product } from "./types";

export type TopPick = { product: Product; image: string; hubSlug: string | null; list: Pick<Page, "slug" | "h1"> & { count: number } };

// The #1 product of a roundup, if it has a photo.
export function topOf(page: Page): TopPick | null {
  const product = page.data.products?.[0];
  const image = product && productImage(product);
  if (!product || !image) return null;
  return { product, image, hubSlug: hubSlugFor(product), list: { slug: page.slug, h1: page.h1, count: page.data.products?.length ?? 0 } };
}

export const pickKey = (pick: TopPick) => pick.product.asin ?? pick.product.name;

// One #1 pick per roundup, taken from each group in turn so the grid isn't all coffee makers:
// groups are departments site-wide, and categories within one department.
// `exclude` skips products already shown elsewhere on the page.
export function getTopPicks(limit: number, opts: { category?: string; department?: string; exclude?: Set<string> } = {}): TopPick[] {
  const deptOf = new Map(categories.map((c) => [c.slug, c.department]));
  // Site-wide and department picks come from full lists (3+ products); a category page shows every list it has.
  const roundups = getAllPages().filter(
    (p) =>
      p.type === "roundup" &&
      (opts.category ? p.category === opts.category : (p.data.products?.length ?? 0) >= 3) &&
      (!opts.department || deptOf.get(p.category ?? "") === opts.department)
  );

  const buckets = new Map<string, TopPick[]>();
  const seen = new Set<string>(opts.exclude);
  for (const page of roundups) {
    const pick = topOf(page);
    const key = pick && pickKey(pick);
    if (!pick || !key || seen.has(key)) continue;
    seen.add(key);
    const group = opts.category ? "all" : opts.department ? (page.category ?? "other") : (deptOf.get(page.category ?? "") ?? "other");
    if (!buckets.has(group)) buckets.set(group, []);
    buckets.get(group)!.push(pick);
  }

  const out: TopPick[] = [];
  const queues = [...buckets.values()];
  while (out.length < limit && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && out.length < limit) out.push(next);
    }
  }
  return out;
}

export type FeaturedProduct = { product: Product; image: string; hubSlug: string | null };
export type GuidePick = { page: Page; featured: FeaturedProduct[] };

const withImage = (product?: Product): FeaturedProduct | null => {
  const image = product && productImage(product);
  return product && image ? { product, image, hubSlug: hubSlugFor(product) } : null;
};

// The product(s) a review, comparison or guide card shows:
// a review's product, both sides of a comparison, or the #1 pick of a guide's related best-of list.
export function guidePick(page: Page): GuidePick {
  let candidates: (Product | undefined)[] = [];
  if (page.type === "review") candidates = [page.data.product];
  else if (page.type === "comparison") candidates = [page.data.productA, page.data.productB];
  else {
    const pages = getAllPages();
    const roundups = [
      ...(page.related ?? []).map((slug) => pages.find((p) => p.slug === slug)),
      ...pages.filter((p) => p.category && p.category === page.category),
    ].filter((p): p is Page => p?.type === "roundup");
    candidates = [roundups.map((r) => r.data.products?.[0]).find((p) => withImage(p))];
  }
  return { page, featured: candidates.map(withImage).filter((f): f is FeaturedProduct => f !== null) };
}

// Ribbons are short: "Best overall" stays, longer badges become "Top pick".
export function ribbonText(badge?: string) {
  if (!badge) return "Top pick";
  return badge.length <= 14 ? badge : /overall/i.test(badge) ? "Best overall" : "Top pick";
}
