import Link from "next/link";
import { hubSlugFor } from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Page } from "@/lib/types";
import { AmazonButton, Disclosure, Faqs, JsonLd, ProCon, ProductImage, Sections } from "../ui";
import { ArticleHeader, Related } from "./shared";

export function ReviewTemplate({ page }: { page: Page }) {
  const product = page.data.product!;
  const hub = hubSlugFor(product);
  // Review schema WITHOUT any rating: we never publish scores we did not measure.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: page.h1,
    reviewBody: page.data.verdict,
    datePublished: page.updatedAt,
    url: absoluteUrl(`/${page.slug}`),
    author: { "@type": "Organization", name: siteConfig.author.name },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    itemReviewed: { "@type": "Product", name: product.name, brand: { "@type": "Brand", name: product.brand } },
  };

  return (
    <article className="container narrow">
      <ArticleHeader page={page}>
        <Disclosure />
      </ArticleHeader>

      <div className="product">
        <div className="product-head">
          <ProductImage product={product} />
          <div>
            {product.badge && <span className="badge">{product.badge}</span>}
            <h2>{product.name}</h2>
            <p className="brand-line">{product.brand}{product.bestFor && <> · Best for {product.bestFor}</>}</p>
          </div>
        </div>
        <p>{product.blurb}</p>
        <ProCon product={product} />
        <div className="product-actions">
          <AmazonButton product={product} />
          {hub && <Link className="btn btn-ghost" href={`/${hub}`}>Where it ranks</Link>}
        </div>
      </div>

      {page.data.verdict && (
        <div className="box">
          <h2>Short verdict</h2>
          <p>{page.data.verdict}</p>
        </div>
      )}

      {page.data.specs && (
        <>
          <h2>Key specs</h2>
          <div className="table-wrap">
            <table className="picks">
              <tbody>
                {page.data.specs.map((s) => (
                  <tr key={s.label}>
                    <th scope="row">{s.label}</th>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small">Specs from the manufacturer. Check the listing for the exact model you buy.</p>
        </>
      )}

      <Sections sections={page.data.sections} />

      {(page.data.whoFor || page.data.notFor) && (
        <div className="two-col">
          {page.data.whoFor && (
            <div>
              <h3>Who it suits</h3>
              <ul>{page.data.whoFor.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
          {page.data.notFor && (
            <div>
              <h3>Who should skip it</h3>
              <ul>{page.data.notFor.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      <Faqs faqs={page.data.faqs} />
      <p style={{ marginTop: 24 }}>
        <AmazonButton product={product} />
      </p>
      <Related slugs={page.related} />
      <JsonLd data={schema} />
    </article>
  );
}
