import type { MetadataRoute } from "next";
import sitemap from "@/data/sitemap.json";
import { CANONICAL_OVERRIDES } from "@/lib/canonical";
import { getProductHubs } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

type Entry = { slug: string; updatedAt: string; priority: number };

export default function siteMap(): MetadataRoute.Sitemap {
  const entries = (sitemap as Entry[])
    .filter((e) => !CANONICAL_OVERRIDES[e.slug])
    .map((e) => ({ url: absoluteUrl(e.slug ? `/${e.slug}` : "/"), lastModified: e.updatedAt, priority: e.priority }));
  const latest = (sitemap as Entry[]).map((e) => e.updatedAt).sort().at(-1);
  const hubs = getProductHubs().map((h) => ({ url: absoluteUrl(`/${h.slug}`), lastModified: latest, priority: 0.5 }));
  return [...entries, ...hubs];
}
