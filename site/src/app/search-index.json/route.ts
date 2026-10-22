import { getAllPages } from "@/lib/content";
import { getProductHubs } from "@/lib/products";

export const dynamic = "force-static";

// Fetched by the search page on demand, so thousands of products don't bloat the JS bundle.
export function GET() {
  const pages = getAllPages().map((p) => ({
    slug: p.slug,
    title: p.h1,
    type: p.type,
    description: p.metaDescription,
    keywords: [p.category ?? "", ...(p.data.products ?? []).map((x) => `${x.name} ${x.brand}`), p.data.product?.name ?? "", p.data.productA?.name ?? "", p.data.productB?.name ?? ""]
      .join(" ")
      .toLowerCase(),
  }));
  const products = getProductHubs().map((h) => ({
    slug: h.slug,
    title: h.product.name,
    type: "product",
    description: h.product.blurb || h.lists[0]?.title || "",
    keywords: `${h.product.brand} ${h.product.bestFor ?? ""} ${h.lists.map((l) => l.title).join(" ")}`.toLowerCase(),
  }));
  return Response.json([...pages, ...products]);
}
