import Link from "next/link";
import { AFFILIATE_REL, amazonUrl } from "@/lib/affiliate";
import { getCategoryMeta, TYPE_LABEL } from "@/lib/content";
import { ribbonText, type GuidePick, type TopPick } from "@/lib/toppicks";
import type { PageType } from "@/lib/types";

function AwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// variant "product": the card is about the product (heading = product name, link = product page).
// variant "list": the card is about a best-of list, shown through its #1 pick (heading = list title, link = list).
export function TopPickCard({ pick, variant = "product" }: { pick: TopPick; variant?: "product" | "list" }) {
  const { product, image, hubSlug, list } = pick;
  const isList = variant === "list";
  const href = isList ? `/${list.slug}` : `/${hubSlug ?? list.slug}`;
  return (
    <article className="pick-card">
      <span className="pick-ribbon" aria-hidden="true">
        {isList ? "#1 pick" : ribbonText(product.badge)}
      </span>
      <Link href={href} className="pick-media" tabIndex={-1} aria-hidden="true">
        <img src={image} alt="" loading="lazy" width={300} height={300} />
      </Link>
      <div className="pick-body">
        <div className="pick-meta">
          <span className="pick-badge">
            <AwardIcon />
            {isList ? "Best of" : (product.badge ?? "Top pick")}
          </span>
          <span className="pick-brand">{isList ? `${list.count} picks` : product.brand}</span>
        </div>
        <h3 className="pick-name">
          <Link href={href}>{isList ? list.h1 : product.name}</Link>
        </h3>
        {isList ? (
          <p className="pick-list">
            #1: <Link href={`/${hubSlug ?? list.slug}`}>{product.name}</Link>
          </p>
        ) : (
          <p className="pick-list">
            In: <Link href={`/${list.slug}`}>{list.h1}</Link>
          </p>
        )}
        {product.features && product.features.length > 0 && (
          <ul className="pick-features">
            {product.features.slice(0, 3).map((f, i) => (
              <li key={i}>
                <Check />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="pick-actions">
          <a className="btn btn-cta pick-cta" href={amazonUrl(product)} rel={AFFILIATE_REL} target="_blank" aria-label={`View ${product.name} on Amazon (opens in a new tab)`}>
            <CartIcon />
            View on Amazon
          </a>
          <Link href={href} className="pick-details">
            {isList ? "See the full list" : "See details"}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TopPicksGrid({ picks, variant = "product" }: { picks: TopPick[]; variant?: "product" | "list" }) {
  if (!picks.length) return null;
  return (
    <div className="pick-grid">
      {picks.map((p) => (
        <TopPickCard key={variant === "list" ? p.list.slug : (p.product.asin ?? p.product.name)} pick={p} variant={variant} />
      ))}
    </div>
  );
}

const GUIDE_LINK: Partial<Record<PageType, string>> = {
  review: "Read the review",
  comparison: "See the comparison",
  "buying-guide": "Read the guide",
  howto: "Read the guide",
  troubleshoot: "Read the guide",
};

// A review, comparison or guide, in the same card style, with Amazon buttons for the product(s) it features.
export function GuideCard({ pick }: { pick: GuidePick }) {
  const { page, featured } = pick;
  const href = `/${page.slug}`;
  const category = getCategoryMeta(page.category);
  const isComparison = featured.length > 1;
  // Short button labels from the title, e.g. "KitchenAid Artisan vs Classic" -> "KitchenAid Artisan", "Classic".
  const sides = page.h1.split(/\s+vs\.?\s+/i);
  const shortName = (i: number) => (sides.length === featured.length ? sides[i] : featured[i].product.name);
  return (
    <article className="pick-card">
      <span className="pick-ribbon" aria-hidden="true">
        {TYPE_LABEL[page.type]}
      </span>
      <Link href={href} className={`pick-media${isComparison ? " pick-media-vs" : ""}`} tabIndex={-1} aria-hidden="true">
        {featured.map((f, i) => (
          <img key={i} src={f.image} alt="" loading="lazy" width={300} height={300} />
        ))}
        {isComparison && <span className="pick-vs">vs</span>}
      </Link>
      <div className="pick-body">
        <div className="pick-meta">
          <span className="pick-badge">
            <AwardIcon />
            {TYPE_LABEL[page.type]}
          </span>
          {category && <span className="pick-brand">{category.title}</span>}
        </div>
        <h3 className="pick-name">
          <Link href={href}>{page.h1}</Link>
        </h3>
        {featured.length === 1 && (
          <p className="pick-list">
            {page.type === "review" ? "Product" : "Top pick"}: <Link href={`/${featured[0].hubSlug ?? page.slug}`}>{featured[0].product.name}</Link>
          </p>
        )}
        <p className="pick-desc">{page.metaDescription}</p>
        <div className="pick-actions">
          {isComparison && <p className="pick-cta-label">View on Amazon</p>}
          {featured.map((f, i) => (
            <a
              key={i}
              className="btn btn-cta pick-cta"
              href={amazonUrl(f.product)}
              rel={AFFILIATE_REL}
              target="_blank"
              aria-label={`View ${f.product.name} on Amazon (opens in a new tab)`}
            >
              <CartIcon />
              {isComparison ? <span className="pick-cta-name">{shortName(i)}</span> : "View on Amazon"}
            </a>
          ))}
          <Link href={href} className="pick-details">
            {GUIDE_LINK[page.type] ?? "Read more"}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GuideCardsGrid({ picks }: { picks: GuidePick[] }) {
  if (!picks.length) return null;
  return (
    <div className="pick-grid">
      {picks.map((p) => (
        <GuideCard key={p.page.slug} pick={p} />
      ))}
    </div>
  );
}
