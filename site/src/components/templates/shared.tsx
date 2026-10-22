import Link from "next/link";
import { departmentOf, getPage, TYPE_LABEL } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { productImage } from "@/lib/affiliate";
import type { Page, Product } from "@/lib/types";
import { Breadcrumbs, Byline, type Crumb } from "../ui";

export function crumbsFor(page: Page): Crumb[] {
  const items: Crumb[] = [];
  const dept = departmentOf(page);
  if (dept && page.type !== "department") items.push({ name: dept.title, href: `/${dept.slug}` });
  if (page.category && page.type !== "category") {
    const cat = getPage(page.category);
    if (cat) items.push({ name: cat.h1, href: `/${cat.slug}` });
  }
  items.push({ name: page.h1 });
  return items;
}

export function ArticleHeader({ page, children }: { page: Page; children?: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={crumbsFor(page)} />
      <span className="chip">{TYPE_LABEL[page.type]}</span>
      <h1>{page.h1}</h1>
      <p className="lede">{page.lede}</p>
      {page.type !== "page" && <Byline updatedAt={page.updatedAt} />}
      {children}
    </>
  );
}

export function articleSchema(page: Page, type = "Article") {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: page.h1,
    description: page.metaDescription,
    dateModified: page.updatedAt,
    mainEntityOfPage: absoluteUrl(`/${page.slug}`),
    author: { "@type": "Organization", name: siteConfig.author.name, url: absoluteUrl("/about") },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function Related({ slugs }: { slugs?: string[] }) {
  const pages = (slugs ?? []).map((s) => getPage(s)).filter((p): p is Page => p !== null);
  if (!pages.length) return null;
  return (
    <section>
      <h2>Related research</h2>
      <div className="grid">
        {pages.map((p) => (
          <PageCard key={p.slug} page={p} />
        ))}
      </div>
    </section>
  );
}

function cardImages(page: Page) {
  const d = page.data;
  return [...(d.products ?? []), d.product, d.productA, d.productB]
    .filter((p): p is Product => Boolean(p))
    .map((p) => ({ src: productImage(p), alt: p.name }))
    .filter((i): i is { src: string; alt: string } => Boolean(i.src))
    .slice(0, 3);
}

export function PageCard({ page }: { page: Page }) {
  const images = cardImages(page);
  return (
    <Link className="card" href={`/${page.slug}`}>
      {images.length > 0 && (
        <span className="card-thumbs" aria-hidden="true">
          {images.map((img) => (
            <img key={img.src} src={img.src} alt="" loading="lazy" width={80} height={80} />
          ))}
        </span>
      )}
      <span className="chip">{TYPE_LABEL[page.type]}</span>
      <h3>{page.h1}</h3>
      <p>{page.metaDescription}</p>
    </Link>
  );
}
