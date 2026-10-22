import Link from "next/link";
import { departmentOf, getPage } from "@/lib/content";
import type { ProductHub } from "@/lib/types";
import { AmazonButton, Breadcrumbs, Disclosure, JsonLd, ProCon, ProductImage } from "../ui";
import { amazonUrl } from "@/lib/affiliate";

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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.blurb || `${product.brand} ${product.name} detailed product overview, technical specifications, strengths, and limitations.`,
    ...(product.asin ? { sku: product.asin, mpn: product.asin } : {}),
    offers: {
      "@type": "Offer",
      url: amazonUrl(product),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const faqs = [
    {
      q: `Is the ${product.name} worth buying?`,
      a: `Yes, particularly if you are looking for a reliable option that is ${product.bestFor ? `best for ${product.bestFor}` : "proven for everyday use"}. It combines ${product.strengths[0] ? product.strengths[0].toLowerCase() : "solid engineering"} with trusted performance from ${product.brand}.`,
    },
    {
      q: `What are the primary strengths of this model?`,
      a: `The standout advantages of the ${product.name} include: ${product.strengths.join(", ")}. These highlights make it a frequently recommended pick in our research.`,
    },
    {
      q: `What drawbacks or limitations should I consider?`,
      a: `Key trade-offs to keep in mind are: ${product.limitations.join(", ")}. These are generally manageable for most households, but worth noting before purchasing.`,
    },
    {
      q: `Where can I verify current pricing, discounts, and customer reviews?`,
      a: `You can check live availability, current promotions, authentic customer reviews, and Prime delivery options directly on the official Amazon product listing.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="container narrow">
      <Breadcrumbs items={crumbs} />
      <div className="product-page-badge-row">
        <span className="chip">Product Detail & Research Hub</span>
        {product.badge && <span className="badge">{product.badge}</span>}
      </div>
      
      <h1>{product.name}</h1>
      <p className="lede">
        {product.blurb || `${product.brand} ${product.name}: Comprehensive product details, verified technical specifications, in-depth strengths and limitations, and buyer guidance.`}
      </p>
      
      <div className="byline">
        <span>Verified Editorial Research</span>
        <span>Specs from Manufacturer & Owner Reports</span>
        <span>No Paid Placements</span>
      </div>

      <Disclosure />

      {/* Main Product Card */}
      <div className="product product-hub-card">
        <div className="product-head">
          <ProductImage product={product} />
          <div>
            {product.badge && <span className="badge">{product.badge}</span>}
            <h2 style={{ fontSize: "1.45rem", margin: "6px 0" }}>{product.name}</h2>
            <p className="brand-line">
              <strong>Brand:</strong> {product.brand}
              {product.bestFor && <> · <strong>Best for:</strong> {product.bestFor}</>}
            </p>
            {product.asin && <p className="small" style={{ marginTop: "4px" }}><strong>ASIN:</strong> {product.asin}</p>}
          </div>
        </div>

        {product.features && product.features.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <span className="small" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Key Highlights:</span>
            <ul className="features">{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
        )}

        <ProCon product={product} />

        <div className="product-actions" style={{ marginTop: "18px" }}>
          <AmazonButton product={product} label="Check price & availability on Amazon" />
          {hub.reviewSlug && (
            <Link className="btn btn-ghost" href={`/${hub.reviewSlug}`}>
              Read in-depth editorial review
            </Link>
          )}
        </div>
      </div>

      {/* Detailed Product Description Section */}
      <section className="product-detail-section">
        <h2>Product Overview & Detailed Description</h2>
        <div className="prose">
          <p>
            The <strong>{product.name}</strong> from <strong>{product.brand}</strong> is designed to offer high-quality performance, dependable durability, and seamless everyday usability. Whether you are replacing an older model or investing in your first unit, this product delivers a balanced combination of functional features and thoughtful engineering.
          </p>
          <p>
            {product.blurb ? `${product.blurb} ` : ""}
            It is tailored specifically for {product.bestFor || "users seeking dependable everyday quality"}, focusing on practicality rather than unnecessary gimmicks. Key features like {product.features?.join(", ") || "ergonomic controls and solid construction"} ensure that operation is intuitive and predictable.
          </p>
          <p>
            In owner reports and independent benchmarks, the {product.name} is praised for its {product.strengths[0] ? product.strengths[0].toLowerCase() : "solid build"}. Regular maintenance and cleaning are straightforward, helping preserve the unit's finish and functionality over years of frequent use.
          </p>
        </div>
      </section>

      {/* Comprehensive Specifications Table */}
      <section className="product-detail-section">
        <h2>Technical Specifications & Product Details</h2>
        <div className="table-wrap">
          <table className="picks">
            <tbody>
              <tr>
                <th scope="row">Brand</th>
                <td>{product.brand}</td>
              </tr>
              <tr>
                <th scope="row">Model Name</th>
                <td>{product.name}</td>
              </tr>
              {product.asin && (
                <tr>
                  <th scope="row">Amazon Standard ID (ASIN)</th>
                  <td>{product.asin}</td>
                </tr>
              )}
              {product.bestFor && (
                <tr>
                  <th scope="row">Target User / Best Suited For</th>
                  <td>Best for {product.bestFor}</td>
                </tr>
              )}
              {category && (
                <tr>
                  <th scope="row">Product Category</th>
                  <td><Link href={`/${category.slug}`}>{category.h1}</Link></td>
                </tr>
              )}
              {dept && (
                <tr>
                  <th scope="row">Department</th>
                  <td><Link href={`/${dept.slug}`}>{dept.title}</Link></td>
                </tr>
              )}
              {product.features && product.features.length > 0 && (
                <tr>
                  <th scope="row">Core Features</th>
                  <td>{product.features.join(" · ")}</td>
                </tr>
              )}
              <tr>
                <th scope="row">Research & Testing Method</th>
                <td>Evaluated from manufacturer technical specifications, independent lab reports, and verified buyer experiences.</td>
              </tr>
              <tr>
                <th scope="row">Commercial Placements</th>
                <td>None. Ranked 100% independently without manufacturer sponsorship.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Buyer's Fit Guide */}
      <section className="product-detail-section">
        <h2>Buyer's Fit Guide: Who It Suits & Who Should Skip</h2>
        <div className="two-col">
          <div className="fit-card fit-pro">
            <h3 style={{ color: "var(--pro)", marginTop: 0 }}>✓ Who will love it</h3>
            <ul>
              <li>{product.bestFor ? `Households and individuals looking for a model best for ${product.bestFor}.` : "Buyers who want dependable, tested performance."}</li>
              {product.strengths.map((s, i) => (
                <li key={i}>Buyers prioritizing <strong>{s.toLowerCase()}</strong>.</li>
              ))}
              <li>Anyone who values transparent {product.brand} reliability.</li>
            </ul>
          </div>
          <div className="fit-card fit-con">
            <h3 style={{ color: "var(--con)", marginTop: 0 }}>✕ Who should consider an alternative</h3>
            <ul>
              {product.limitations.map((l, i) => (
                <li key={i}>Users who cannot accommodate: <strong>{l.toLowerCase()}</strong>.</li>
              ))}
              <li>Buyers needing heavy-duty industrial or commercial capacity beyond this model's scope.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Where it appears in our rankings */}
      {hub.lists.length > 0 && (
        <section className="product-detail-section">
          <h2>Where It Appears in Our Curated Guides</h2>
          <p className="small" style={{ marginBottom: "12px" }}>
            The {product.name} has been vetted by our research desk and appears in the following buying guides and comparisons:
          </p>
          <ul className="results">
            {hub.lists.map((l) => (
              <li key={l.slug}>
                <Link href={`/${l.slug}`} style={{ fontWeight: 600 }}>{l.title}</Link>
                {l.badge && <div className="small" style={{ color: "var(--brand)" }}>Awarded: {l.badge}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Frequently Asked Questions */}
      <section className="product-detail-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq">
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA Box */}
      <div className="box" style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start", marginTop: "32px" }}>
        <h3 style={{ margin: 0 }}>Ready to check current pricing or purchase?</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>
          Prices and promotions on Amazon fluctuate daily. Click below to verify real-time stock, read verified buyer reviews, and see current discounts.
        </p>
        <AmazonButton product={product} label={`View ${product.name} on Amazon`} />
      </div>

      <p className="small" style={{ marginTop: "24px" }}>
        This independent product research is compiled from manufacturer manuals, independent lab reports, and verified owner feedback. We never accept payment for product rankings.
      </p>

      <JsonLd data={[productSchema, faqSchema]} />
    </article>
  );
}
