import { hubSlugFor } from "@/lib/products";
import { amazonUrl } from "@/lib/affiliate";
import { slugify } from "@/lib/slug";
import type { Page } from "@/lib/types";
import { Disclosure, Faqs, JsonLd, ProductCard, Sections } from "../ui";
import { ArticleHeader, articleSchema, Related } from "./shared";

export function RoundupTemplate({ page }: { page: Page }) {
  const products = page.data.products ?? [];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.h1,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: amazonUrl(p) })),
  };

  return (
    <article className="container narrow">
      <ArticleHeader page={page}>
        <Disclosure />
      </ArticleHeader>

      <h2 id="quick-picks">Quick picks</h2>
      <div className="table-wrap">
        <table className="picks">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Best for</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.name}>
                <th scope="row">
                  <a href={`#${slugify(p.name)}`}>
                    {i + 1}. {p.name}
                  </a>
                  {p.badge && (
                    <>
                      <br />
                      <span className="small">{p.badge}</span>
                    </>
                  )}
                </th>
                <td>{p.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.map((p, i) => {
        const hub = hubSlugFor(p);
        return <ProductCard key={p.name} product={p} rank={i + 1} id={slugify(p.name)} hubHref={hub ? `/${hub}` : null} />;
      })}

      {page.data.howWeChose && (
        <div className="box">
          <h2>How we chose</h2>
          <ul>{page.data.howWeChose.map((h, i) => <li key={i}>{h}</li>)}</ul>
        </div>
      )}

      <Sections sections={page.data.sections} />
      <Faqs faqs={page.data.faqs} />
      <Related slugs={page.related} />
      <JsonLd data={[articleSchema(page), itemList]} />
    </article>
  );
}
