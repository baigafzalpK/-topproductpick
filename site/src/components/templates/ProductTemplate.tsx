import Link from "next/link";
import { departmentOf, getPage } from "@/lib/content";
import type { ProductHub } from "@/lib/types";
import { AmazonButton, Breadcrumbs, Disclosure, ProCon, ProductImage } from "../ui";

export function ProductTemplate({ hub }: { hub: ProductHub }) {
  const { product } = hub;
  const firstList = hub.lists[0] ? getPage(hub.lists[0].slug) : null;
  const category = firstList?.category ? getPage(firstList.category) : null;
  const dept = firstList ? departmentOf(firstList) : null;
  const crumbs = [
    ...(dept ? [{ name: dept.title, href: `/${dept.slug}` }] : []),
    ...(category ? [{ name: category.h1, href: `/${category.slug}` }] : []),
    { name: product.name },
  ];

  return (
    <article className="container narrow">
      <Breadcrumbs items={crumbs} />
      <span className="chip">Product</span>
      <h1>{product.name}</h1>
      <p className="lede">{product.blurb || `${product.brand} ${product.name}: key specs, strengths and limitations, and the lists it appears in.`}</p>
      <Disclosure />

      <div className="product">
        <div className="product-head">
          <ProductImage product={product} />
          <div>
            <p className="brand-line">Brand: {product.brand}</p>
            {product.bestFor && <p style={{ margin: "4px 0" }}>Best for {product.bestFor}</p>}
            {product.asin && <p className="small">ASIN {product.asin}</p>}
          </div>
        </div>
        {product.features && product.features.length > 0 && (
          <ul className="features">{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
        )}
        <ProCon product={product} />
        <div className="product-actions">
          <AmazonButton product={product} />
          {hub.reviewSlug && (
            <Link className="btn btn-ghost" href={`/${hub.reviewSlug}`}>
              Read the full review
            </Link>
          )}
        </div>
      </div>

      {hub.lists.length > 0 && (
        <section>
          <h2>Where it appears</h2>
          <ul className="results">
            {hub.lists.map((l) => (
              <li key={l.slug}>
                <Link href={`/${l.slug}`}>{l.title}</Link>
                {l.badge && <div className="small">{l.badge}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="small">
        This summary is based on manufacturer specs, independent reviews and owner reports. We do not publish prices or star ratings because they change; check Amazon for current details.
      </p>
    </article>
  );
}
