import Link from "next/link";
import { getAllPages, getCategoriesByDepartment } from "@/lib/content";
import { getTopPicks, guidePick, pickKey, topOf } from "@/lib/toppicks";
import type { Page } from "@/lib/types";
import { GuideCardsGrid, TopPicksGrid } from "../TopPicks";
import { Breadcrumbs } from "../ui";

const GUIDE_ORDER = ["review", "comparison", "buying-guide", "howto", "troubleshoot"];

export function DepartmentTemplate({ page }: { page: Page }) {
  const cats = getCategoriesByDepartment(page.slug);
  const catSlugs = new Set(cats.map((c) => c.slug));
  const pages = getAllPages().filter((p) => p.category && catSlugs.has(p.category));

  // Category pages list everything; the department shows a sample so the page stays light.
  const topPicks = getTopPicks(8, { department: page.slug });
  const shown = new Set(topPicks.map(pickKey));
  // Best-of lists shown through their #1 product, skipping products already in "Top picks".
  const lists = pages
    .filter((p) => p.type === "roundup")
    .map(topOf)
    .filter((pick): pick is NonNullable<typeof pick> => pick !== null && !shown.has(pickKey(pick)))
    .slice(0, 12);
  const guides = pages
    .filter((p) => GUIDE_ORDER.includes(p.type))
    .sort((a, b) => GUIDE_ORDER.indexOf(a.type) - GUIDE_ORDER.indexOf(b.type))
    .map(guidePick)
    .filter((g) => g.featured.length > 0)
    .slice(0, 12);

  return (
    <div className="container">
      <Breadcrumbs items={[{ name: page.h1 }]} />
      <div className="narrow">
        <span className="chip">Department</span>
        <h1>{page.h1}</h1>
        <p className="lede">{page.lede}</p>
      </div>

      {topPicks.length > 0 && (
        <section className="swipe-row">
          <h2>Top picks in {page.h1}</h2>
          <TopPicksGrid picks={topPicks} />
        </section>
      )}

      <section>
        <h2>Categories</h2>
        <ul className="dept-row-cats dept-cats-all">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className="pill">
                {c.title} <span className="small">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {lists.length > 0 && (
        <section className="swipe-row">
          <h2>Best-of lists</h2>
          <TopPicksGrid picks={lists} variant="list" />
        </section>
      )}
      {guides.length > 0 && (
        <section className="swipe-row">
          <h2>Reviews, comparisons and guides</h2>
          <GuideCardsGrid picks={guides} />
        </section>
      )}
    </div>
  );
}
