import type { Page } from "@/lib/types";
import { Faqs, JsonLd, Sections } from "../ui";
import { ArticleHeader, articleSchema, Related } from "./shared";

export function GuideTemplate({ page }: { page: Page }) {
  const sections = page.data.sections ?? [];
  const isPlain = page.type === "page";
  return (
    <article className="container narrow">
      <ArticleHeader page={page} />
      {!isPlain && sections.length > 2 && (
        <nav className="toc" aria-label="On this page">
          <strong>On this page</strong>
          <ol>
            {sections.map((s, i) => (
              <li key={i}>
                <a href={`#s-${i + 1}`}>{s.h}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <Sections sections={sections} />
      <Faqs faqs={page.data.faqs} />
      <Related slugs={page.related} />
      {!isPlain && <JsonLd data={articleSchema(page, page.type === "howto" || page.type === "troubleshoot" ? "TechArticle" : "Article")} />}
    </article>
  );
}
