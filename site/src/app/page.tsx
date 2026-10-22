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
      <section className="hero-banner">
        <div className="hero-decorations" aria-hidden="true">
          <div className="hero-circle hero-circle-1" />
          <div className="hero-circle hero-circle-2" />
          <div className="hero-circle hero-circle-3" />
        </div>
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Find the right product, <span className="hero-highlight">not just the popular one.</span>
            </h1>
            <p className="hero-lead">
              Research-driven best-of lists, head-to-head comparisons and plain-language buying guides, so you can buy once and buy right.
            </p>
            <form className="hero-search-box" action="/search" role="search">
              <label htmlFor="home-q" className="skip">
                Search
              </label>
              <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input id="home-q" name="q" type="search" placeholder="Search 1,800+ guides, reviews & comparisons" />
              <button className="hero-search-btn" type="submit" aria-label="Search">
                Search
              </button>
            </form>
            <div className="hero-popular" aria-label="Popular topics">
              <span className="hero-popular-label">Popular:</span>
              <Link href="/air-fryers" className="hero-tag-pill">Air fryers</Link>
              <Link href="/espresso-machines" className="hero-tag-pill">Espresso machines</Link>
              <Link href="/robot-vacuums" className="hero-tag-pill">Robot vacuums</Link>
              <Link href="/standing-desks" className="hero-tag-pill">Standing desks</Link>
              <Link href="/3d-printers" className="hero-tag-pill">3D printers</Link>
            </div>
          </div>

          <div className="hero-gallery-wrap">
            <div className="hero-gallery">
              <div className="hero-img-card hero-img-tall">
                <img
                  src="/images/hero/hero-main.jpg"
                  alt="Reviewing and testing digital camera gear"
                  width={540}
                  height={680}
                  loading="eager"
                />
              </div>
              <div className="hero-img-card hero-img-top">
                <img
                  src="/images/hero/hero-kitchen.jpg"
                  alt="Testing kitchen espresso machines"
                  width={460}
                  height={320}
                  loading="eager"
                />
              </div>
              <div className="hero-img-card hero-img-bottom">
                <img
                  src="/images/hero/hero-desk.jpg"
                  alt="Ergonomic desk and headphone listening"
                  width={460}
                  height={320}
                  loading="eager"
                />
              </div>
            </div>

            <div className="hero-trust-badge">
              <div className="trust-badge-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div className="trust-badge-text">
                <strong>No paid placements</strong>
                <span>Rankings can't be bought</span>
              </div>
            </div>
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
