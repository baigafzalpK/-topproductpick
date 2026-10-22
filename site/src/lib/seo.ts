import type { Metadata } from "next";
import overrides from "@/data/seo-overrides.json";
import { canonicalSlug } from "./canonical";
import { absoluteUrl, siteConfig } from "./site";

const MAX_TITLE = 60;
const MAX_DESC = 155;

function clip(s: string, max: number) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-–—]+$/, "")}…`;
}

export function pageTitle(slug: string, fallback: string) {
  const o = (overrides as Record<string, { title?: string }>)[slug];
  const t = o?.title ?? fallback;
  const withBrand = `${t} | ${siteConfig.name}`;
  return withBrand.length <= MAX_TITLE ? withBrand : clip(t, MAX_TITLE);
}

export function pageDescription(slug: string, fallback: string) {
  const o = (overrides as Record<string, { description?: string }>)[slug];
  return clip(o?.description ?? fallback, MAX_DESC);
}

export function buildMetadata(opts: {
  slug: string;
  title: string;
  description: string;
  type?: "article" | "website";
}): Metadata {
  const title = pageTitle(opts.slug, opts.title);
  const description = pageDescription(opts.slug, opts.description);
  const url = absoluteUrl(opts.slug ? `/${canonicalSlug(opts.slug)}` : "/");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: siteConfig.name, type: opts.type ?? "article", locale: siteConfig.locale },
    twitter: { card: "summary", title, description },
  };
}
