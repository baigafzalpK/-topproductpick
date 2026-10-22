import { getPagesByCategory, TYPE_LABEL } from "@/lib/content";
import { guidePick, topOf } from "@/lib/toppicks";
import type { Page, PageType } from "@/lib/types";
import { GuideCardsGrid, TopPicksGrid } from "../TopPicks";
import { Sections } from "../ui";
import { ArticleHeader, PageCard } from "./shared";

const ORDER: PageType[] = ["roundup", "review", "comparison", "buying-guide", "howto", "troubleshoot"];
const HEADINGS: Partial<Record<PageType, string>> = {
  roundup: "Best-of lists",
  review: "Reviews",
  comparison: "Comparisons",
  "buying-guide": "Buying guides",
  howto: "How-to guides",
  troubleshoot: "Troubleshooting",
};

// Each section uses product cards (with "View on Amazon") where the page has a product photo,
// and plain text cards for the rest so nothing is left out.
function SectionCards({ type, pages }: { type: PageType; pages: Page[] }) {
  if (type === "roundup") {
    const picks = pages.map(topOf);
    const withCards = picks.filter((p): p is NonNullable<typeof p> => p !== null);
    const rest = pages.filter((_, i) => picks[i] === null);
    return (
      <>
        <TopPicksGrid picks={withCards} variant="list" />
        {rest.length > 0 && (
          <div className="grid" style={{ marginTop: 20 }}>
            {rest.map((p) => (
              <PageCard key={p.slug} page={p} />
            ))}
          </div>
        )}
      </>
    );
  }
  const guides = pages.map(guidePick);
  const withCards = guides.filter((g) => g.featured.length > 0);
  const rest = guides.filter((g) => g.featured.length === 0).map((g) => g.page);
  return (
    <>
      <GuideCardsGrid picks={withCards} />
      {rest.length > 0 && (
        <div className="grid" style={{ marginTop: 20 }}>
          {rest.map((p) => (
            <PageCard key={p.slug} page={p} />
          ))}
        </div>
      )}
    </>
  );
}

export function CategoryTemplate({ page }: { page: Page }) {
  const children = getPagesByCategory(page.slug);
  return (
    <div className="container">
      <div className="narrow">
        <ArticleHeader page={page} />
      </div>
      {ORDER.map((type) => {
        const list = children.filter((p) => p.type === type);
        if (!list.length) return null;
        return (
          <section key={type}>
            <h2>{HEADINGS[type] ?? TYPE_LABEL[type]}</h2>
            <SectionCards type={type} pages={list} />
          </section>
        );
      })}
      <div className="narrow">
        <Sections sections={page.data.sections} />
      </div>
    </div>
  );
}
