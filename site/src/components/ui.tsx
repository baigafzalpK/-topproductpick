import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { AFFILIATE_REL, amazonUrl, productImage } from "@/lib/affiliate";
import type { Faq, Product, Section } from "@/lib/types";

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {all.map((c, i) => (
          <li key={i}>{c.href && i < all.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}

export function Byline({ updatedAt }: { updatedAt: string }) {
  const d = new Date(updatedAt);
  return (
    <div className="byline">
      <span>
        By <Link href="/about">{siteConfig.author.name}</Link>
      </span>
      <span>
        Updated <time dateTime={updatedAt}>{d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>
      </span>
      <span>
        <Link href="/methodology">How we research</Link>
      </span>
    </div>
  );
}

export function Disclosure() {
  return (
    <p className="disclosure">
      {siteConfig.disclosureShort} <Link href="/affiliate-disclosure">Learn more</Link>
    </p>
  );
}

export function AmazonButton({ product, label = "Check price on Amazon" }: { product: Product; label?: string }) {
  return (
    <a className="btn btn-cta" href={amazonUrl(product)} rel={AFFILIATE_REL} target="_blank">
      {label}
      <span aria-hidden="true">&#8599;</span>
    </a>
  );
}

function ProductIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}

export function ProductImage({ product }: { product: Product }) {
  const src = productImage(product);
  return (
    <div className="product-img">
      {src ? (
        <img src={src} alt={product.name} loading="lazy" width={132} height={132} />
      ) : (
        <span className="img-fallback">
          <ProductIcon />
          <span>{product.brand}</span>
        </span>
      )}
    </div>
  );
}

export function ProCon({ product }: { product: Product }) {
  return (
    <div className="procon">
      <div className="pros">
        <h4>Strengths</h4>
        <ul>{product.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>
      <div className="cons">
        <h4>Limitations</h4>
        <ul>{product.limitations.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>
    </div>
  );
}

export function ProductCard({ product, rank, id, hubHref, as = "h2" }: { product: Product; rank?: number; id?: string; hubHref?: string | null; as?: "h2" | "h3" }) {
  const H = as;
  return (
    <article className="product" id={id}>
      <div className="product-head">
        <ProductImage product={product} />
        <div>
          {product.badge && <span className="badge">{product.badge}</span>}
          <H>
            {rank && <span className="rank">{rank}.</span>}
            {hubHref ? <Link href={hubHref}>{product.name}</Link> : product.name}
          </H>
          <p className="brand-line">
            {product.brand}
            {product.bestFor && <> · Best for {product.bestFor}</>}
          </p>
        </div>
      </div>
      {product.blurb && <p>{product.blurb}</p>}
      {product.features && product.features.length > 0 && (
        <ul className="features">{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
      )}
      <ProCon product={product} />
      <div className="product-actions">
        <AmazonButton product={product} />
        {hubHref && (
          <Link className="btn btn-ghost" href={hubHref}>
            Product details
          </Link>
        )}
      </div>
    </article>
  );
}

export function Sections({ sections }: { sections?: Section[] }) {
  if (!sections?.length) return null;
  return (
    <div className="prose">
      {sections.map((s, i) => (
        <section key={i}>
          <h2 id={`s-${i + 1}`}>{s.h}</h2>
          {s.p.map((p, j) => <p key={j}>{p}</p>)}
          {s.list && <ul>{s.list.map((li, j) => <li key={j}>{li}</li>)}</ul>}
        </section>
      ))}
    </div>
  );
}

export function Faqs({ faqs }: { faqs?: Faq[] }) {
  if (!faqs?.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="faq">
      <h2 id="faq">Frequently asked questions</h2>
      {faqs.map((f, i) => (
        <details key={i}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
      <JsonLd data={schema} />
    </section>
  );
}
