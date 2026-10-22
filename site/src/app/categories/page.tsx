import Link from "next/link";
import { Breadcrumbs } from "@/components/ui";
import { departments, getCategoriesByDepartment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ slug: "categories", title: "All Categories", description: "Browse every product category we research, from kitchen appliances to earbuds, toothbrushes and outdoor gear.", type: "website" });

export default function CategoriesPage() {
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "Categories" }]} />
      <h1>All categories</h1>
      {departments.map((d) => (
        <section key={d.slug}>
          <div className="section-head">
            <h2>{d.title}</h2>
            <Link href={`/${d.slug}`}>View department</Link>
          </div>
          <div className="grid">
            {getCategoriesByDepartment(d.slug).map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="card cat-card">
                <span className="cat-icon" aria-hidden="true">
                  {c.icon}
                </span>
                <span>
                  <h3 style={{ marginTop: 0 }}>{c.title}</h3>
                  <p>{c.blurb}</p>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
