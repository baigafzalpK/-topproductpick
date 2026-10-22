// ★ Brand config. Change these when cloning the site.
export const siteConfig = {
  name: "TopProductPick",
  tagline: "Top products, best choices.",
  description:
    "Independent product research across home, kitchen, electronics, health and outdoor gear: best-of lists, reviews, comparisons and buying guides built from manufacturer specs, independent reviews and owner reports.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://topproductpick.com").replace(/\/$/, ""),
  amazonTag: process.env.NEXT_PUBLIC_AMAZON_TAG ?? "topproduc01aa-20",
  amazonMarketplace: "www.amazon.com",
  productImages: process.env.NEXT_PUBLIC_PRODUCT_IMAGES ?? "legacy",
  contactEmail: "hello@topproductpick.com",
  locale: "en_US",
  organization: {
    name: "TopProductPick",
    legalName: "TopProductPick",
    foundingDate: "2026",
    description: "TopProductPick publishes independent buying research for everyday products, from kitchen appliances to electronics and outdoor gear.",
  },
  author: { name: "TopProductPick Research Desk", role: "Editorial research team" },
  disclosureShort: "As an Amazon Associate I earn from qualifying purchases.",
  disclosureLong:
    "TopProductPick is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate I earn from qualifying purchases. This never changes which products we recommend.",
};

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.organization.name,
    legalName: siteConfig.organization.legalName,
    foundingDate: siteConfig.organization.foundingDate,
    description: siteConfig.organization.description,
    url: siteConfig.url,
    logo: absoluteUrl("/images/brand/logo.png"),
    email: siteConfig.contactEmail,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={query}`,
      "query-input": "required name=query",
    },
  };
}
