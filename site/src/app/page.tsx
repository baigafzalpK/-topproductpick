import Link from "next/link";
import { GuideCardsGrid, TopPicksGrid } from "@/components/TopPicks";
import { departments, getAllPages, getCategoriesByDepartment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getTopPicks, guidePick, pickKey, topOf } from "@/lib/toppicks";

export const metadata = buildMetadata({ slug: "", title: "Best Product Picks and Buying Guides", description: siteConfig.description, type: "website" });

export default function Home() {
  const pages = getAllPages();
  // Lists with product photos look best on the homepage, so they come first.
  const photoCount = (p: (typeof pages)[number]) => (p.data.products ?? []).filter((x) => x.asin).length;
  const allRoundups = pages
    .filter((p) => p.type === "roundup" && photoCount(p) >= 3)
    .sort((a, b) => Number(Boolean(a.imported)) - Number(Boolean(b.imported)) || photoCount(b) - photoCount(a));
  const roundups = allRoundups.slice(0, 12);
  // Reviews first, then comparisons, then guides; each card features the product(s) the page is about.
  const GUIDE_ORDER = ["review", "comparison", "buying-guide", "howto"];
  const guides = pages
    .filter((p) => GUIDE_ORDER.includes(p.type))
    .sort((a, b) => GUIDE_ORDER.indexOf(a.type) - GUIDE_ORDER.indexOf(b.type))
    .map(guidePick)
    .filter((g) => g.featured.length > 0)
    .slice(0, 12);
  const topPicks = getTopPicks(8);
  // Four more picks per department, skipping products already in "Top picks right now".
  const shown = new Set(topPicks.map(pickKey));
  const deptRows = departments
    .map((dept) => ({ dept, cats: getCategoriesByDepartment(dept.slug), picks: getTopPicks(4, { department: dept.slug, exclude: shown }) }))
    .filter((row) => row.picks.length > 0);
  // Best-of lists shown through their #1 product; skip lists whose #1 already appears above.
  for (const row of deptRows) row.picks.forEach((p) => shown.add(pickKey(p)));
  const latestLists = allRoundups
    .map(topOf)
    .filter((pick) => pick !== null && !shown.has(pickKey(pick)))
    .slice(0, 12) as NonNullable<ReturnType<typeof topOf>>[];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Independent buying research</span>
            <h1>Buy the right one the first time.</h1>
            <p className="lead">
              {siteConfig.name} compares products across home, tech, health and outdoor gear using manufacturer specs, independent reviews and owner reports, so you can skip the returns.
            </p>
            <form className="search-form" action="/search" role="search">
              <label htmlFor="home-q" className="skip">
                Search
              </label>
              <input id="home-q" name="q" type="search" placeholder="Search earbuds, blenders, toothbrushes…" />
              <button className="btn btn-brand" type="submit">
                Search
              </button>
            </form>
            <div className="quick-links" aria-label="Popular lists">
              <span className="small">Popular:</span>
              {roundups.slice(0, 5).map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="pill">
                  {p.h1.replace(/^The \d+ /, "")}
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <h2>How we pick</h2>
            <ol>
              <li>Read manufacturer specs and manuals.</li>
              <li>Cross-check independent reviews and owner reports.</li>
              <li>Match each product to the buyer it suits best.</li>
              <li>Say plainly what it does badly.</li>
            </ol>
            <p className="small" style={{ marginBottom: 0 }}>
              We never invent test results, ratings or prices. <Link href="/methodology">Our method</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <h2>Top picks right now</h2>
          <Link href="/categories">See every category</Link>
        </div>
        <TopPicksGrid picks={topPicks} />
      </section>

      <section className="container">
        <div className="section-head">
          <h2>Shop by department</h2>
          <Link href="/categories">All categories</Link>
        </div>
        {deptRows.map(({ dept: d, cats, picks }) => (
          <div key={d.slug} className="dept-row">
            <div className="dept-row-head">
              <Link href={`/${d.slug}`} className="dept-head">
                <span className="cat-icon" aria-hidden="true">
                  {d.icon}
                </span>
                <span>
                  <h3>{d.title}</h3>
                  <span className="small">{cats.length} categories</span>
                </span>
              </Link>
              <Link href={`/${d.slug}`} className="dept-row-all">
                View all {d.short}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="dept-row-cats">
              {cats.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="pill">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
            <TopPicksGrid picks={picks} />
          </div>
        ))}
      </section>

      <section className="container swipe-row">
        <div className="section-head">
          <h2>Latest best-of lists</h2>
          <Link href="/categories">Browse all lists</Link>
        </div>
        <TopPicksGrid picks={latestLists} variant="list" />
      </section>

      <section className="container swipe-row">
        <h2>Reviews, comparisons and guides</h2>
        <GuideCardsGrid picks={guides} />
      </section>

      <section className="container">
        <div className="trust-strip">
          <div>
            <strong>No invented ratings</strong>
            <span>We never publish scores or test results we didn&apos;t measure.</span>
          </div>
          <div>
            <strong>No paid placements</strong>
            <span>Brands can&apos;t pay to be listed or ranked.</span>
          </div>
          <div>
            <strong>Honest limitations</strong>
            <span>Every product gets a list of what it does badly.</span>
          </div>
        </div>
      </section>
    </>
  );
}
