import { hubSlugFor } from "@/lib/products";
import type { Page } from "@/lib/types";
import { Disclosure, Faqs, JsonLd, ProductCard, Sections } from "../ui";
import { ArticleHeader, articleSchema, Related } from "./shared";

export function ComparisonTemplate({ page }: { page: Page }) {
  const a = page.data.productA!;
  const b = page.data.productB!;
  const hubA = hubSlugFor(a);
  const hubB = hubSlugFor(b);

  return (
    <article className="container narrow">
      <ArticleHeader page={page}>
        <Disclosure />
      </ArticleHeader>

      {page.data.verdict && (
        <div className="box">
          <h2>The short answer</h2>
          <p>{page.data.verdict}</p>
        </div>
      )}

      {page.data.rows && (
        <>
          <h2>Side by side</h2>
          <div className="table-wrap">
            <table className="picks">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">{a.name}</th>
                  <th scope="col">{b.name}</th>
                </tr>
              </thead>
              <tbody>
                {page.data.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td>{r.a}</td>
                    <td>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ProductCard product={a} hubHref={hubA ? `/${hubA}` : null} />
      <ProductCard product={b} hubHref={hubB ? `/${hubB}` : null} />
      <Sections sections={page.data.sections} />
      <Faqs faqs={page.data.faqs} />
      <Related slugs={page.related} />
      <JsonLd data={articleSchema(page)} />
    </article>
  );
}
