// Duplicate pages point their canonical at the stronger page (no redirects).
// Pages listed here as keys are left out of the sitemap.
export const CANONICAL_OVERRIDES: Record<string, string> = {
  // "best-air-fryers-for-two": "best-small-air-fryers",
};

export function canonicalSlug(slug: string) {
  return CANONICAL_OVERRIDES[slug] ?? slug;
}
