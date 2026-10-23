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
      <section className="hero-editorial">
        <div className="hero-editorial-bg" style={{ backgroundImage: "url('/images/hero/hero-watercolor-bg.jpg')" }}>
          <div className="hero-editorial-overlay" />
        </div>

        <div className="container hero-editorial-grid">
          {/* Left Column */}
          <div className="hero-editorial-content">
            <h1 className="hero-editorial-title">
              Every product,<br />
              honestly<br />
              researched.
            </h1>
            <p className="hero-editorial-lead">
              True Picks Daily reads the manuals, the specs and thousands of owner reports — across kitchen, tech, home, outdoors and every category worth buying in — so you can skip the guesswork and buy with confidence.
            </p>

            <form className="hero-editorial-search" action="/search" role="search">
              <label htmlFor="home-q" className="skip">
                Search
              </label>
              <input
                id="home-q"
                name="q"
                type="search"
                placeholder="Search products, guides, reviews..."
                autoComplete="off"
              />
              <button type="submit" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </form>

            <div className="hero-editorial-try" aria-label="Popular search topics">
              <span className="try-label">Try:</span>
              <Link href="/air-fryers" className="try-pill">Air fryer</Link>
              <Link href="/best-robot-vacuums" className="try-pill">Robot vacuum</Link>
              <Link href="/wireless-earbuds" className="try-pill">Wireless earbuds</Link>
              <Link href="/espresso-machines" className="try-pill">Espresso machine</Link>
              <Link href="/standing-desks" className="try-pill">Standing desk</Link>
            </div>

            <div className="hero-editorial-footnote">
              <span className="footnote-trust">No paid placements · No invented ratings · Research-based picks</span>
              <span className="footnote-affiliate">As an Amazon Associate I earn from qualifying purchases.</span>
            </div>
          </div>

          {/* Right Column - Picks of the Week Orbit Widget */}
          <div className="hero-editorial-widget-wrap">
            <div className="orbit-constellation">
              {/* Dashed Connecting Diamond Lines */}
              <svg className="orbit-lines" viewBox="0 0 440 440" aria-hidden="true">
                <polygon
                  points="220,52 388,220 220,388 52,220"
                  fill="none"
                  stroke="#c05621"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  opacity="0.45"
                />
              </svg>

              {/* Central Badge */}
              <div className="orbit-center-card">
                <span className="orbit-pill">PICKS OF THE WEEK</span>
                <span className="orbit-title">
                  4 picks, 4<br />product types
                </span>
                <span className="orbit-sub">Hover a product for details</span>
              </div>

              {/* Top Node: Robot Vacuum */}
              <div className="orbit-node orbit-node-top">
                <Link href="/best-robot-vacuums" className="orbit-disc" aria-label="Robot Vacuums Pick">
                  <img src="/images/hero/product-vacuum.jpg" alt="Robot vacuum" width={80} height={80} />
                  <div className="orbit-tooltip">
                    <strong>iRobot Roomba j7+</strong>
                    <span>Best overall robot vacuum</span>
                  </div>
                </Link>
              </div>

              {/* Left Node: Over-ear Headphones */}
              <div className="orbit-node orbit-node-left">
                <Link href="/noise-cancelling-headphones" className="orbit-disc" aria-label="Wireless Headphones Pick">
                  <img src="/images/hero/product-headphones.jpg" alt="Wireless headphones" width={76} height={76} />
                  <div className="orbit-tooltip">
                    <strong>Sony WH-1000XM5</strong>
                    <span>Top noise cancelling headphones</span>
                  </div>
                </Link>
              </div>

              {/* Right Node: Camping Tent */}
              <div className="orbit-node orbit-node-right">
                <Link href="/outdoor-and-garden" className="orbit-disc" aria-label="Camping Tent Pick">
                  <img src="/images/hero/product-tent.jpg" alt="Camping tent" width={82} height={82} />
                  <div className="orbit-tooltip">
                    <strong>Coleman Sundome</strong>
                    <span>Best starter camping tent</span>
                  </div>
                </Link>
              </div>

              {/* Bottom Node: Espresso Machine */}
              <div className="orbit-node orbit-node-bottom">
                <Link href="/espresso-machines" className="orbit-disc" aria-label="Espresso Machine Pick">
                  <img src="/images/hero/product-espresso.jpg" alt="Espresso machine" width={76} height={76} />
                  <div className="orbit-tooltip">
                    <strong>Breville Barista Express</strong>
                    <span>Best all-in-one espresso</span>
                  </div>
                </Link>
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
