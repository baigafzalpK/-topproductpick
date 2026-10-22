// ★ The ONLY place Amazon links and images are built.
import { siteConfig } from "./site";
import type { Product } from "./types";

export const AFFILIATE_REL = "sponsored nofollow noopener";

export function amazonUrl(product: Pick<Product, "asin" | "searchQuery" | "name">) {
  const base = `https://${siteConfig.amazonMarketplace}`;
  const tag = encodeURIComponent(siteConfig.amazonTag);
  if (product.asin) return `${base}/dp/${product.asin}?tag=${tag}`;
  // No verified ASIN yet: send the reader to an Amazon search instead of guessing a listing.
  const q = encodeURIComponent(product.searchQuery || product.name);
  return `${base}/s?k=${q}&tag=${tag}`;
}

export function productImage(product: Pick<Product, "asin" | "image" | "noImage">): string | null {
  if (product.image) return product.image;
  if (product.noImage) return null;
  if (product.asin && siteConfig.productImages === "legacy") {
    return `https://m.media-amazon.com/images/P/${product.asin}.01.LZZZZZZZ.jpg`;
  }
  return null;
}
