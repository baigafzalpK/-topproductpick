"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

function Chevron() {
  return (
    <svg className="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header-editorial">
      <div className="container header-editorial-row">
        <Logo />

        <nav className="header-editorial-nav" aria-label="Primary navigation">
          <ul className="nav-menu">
            <li className="nav-item">
              <button type="button" className="nav-link">
                Categories <Chevron />
              </button>
              <div className="nav-dropdown">
                <div className="nav-dropdown-col">
                  <strong>Departments</strong>
                  <Link href="/kitchen-and-dining">Kitchen &amp; Dining</Link>
                  <Link href="/electronics">Electronics &amp; Tech</Link>
                  <Link href="/home-and-living">Home &amp; Living</Link>
                  <Link href="/outdoor-and-garden">Outdoor &amp; Garden</Link>
                  <Link href="/tools-and-workshop">Tools &amp; Workshop</Link>
                  <Link href="/categories" style={{ color: "var(--brand)", fontWeight: 700, marginTop: "6px" }}>
                    See all categories &rarr;
                  </Link>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <button type="button" className="nav-link">
                Brewing Gear <Chevron />
              </button>
              <div className="nav-dropdown">
                <div className="nav-dropdown-col">
                  <strong>Coffee &amp; Brewing</strong>
                  <Link href="/espresso-machines">Espresso Machines</Link>
                  <Link href="/coffee-makers">Coffee Makers</Link>
                  <Link href="/coffee-grinders">Coffee Grinders</Link>
                  <Link href="/electric-kettles">Electric Kettles</Link>
                  <Link href="/breville-bambino-plus-review">Breville Bambino Review</Link>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <button type="button" className="nav-link">
                Reviews &amp; Compare <Chevron />
              </button>
              <div className="nav-dropdown">
                <div className="nav-dropdown-col">
                  <strong>Comparisons &amp; Best-Of</strong>
                  <Link href="/best-air-fryers">Best Air Fryers</Link>
                  <Link href="/best-robot-vacuums">Best Robot Vacuums</Link>
                  <Link href="/ninja-af101-vs-cosori-pro-le">Ninja AF101 vs COSORI Pro LE</Link>
                  <Link href="/instant-pot-duo-vs-duo-plus">Instant Pot Duo vs Duo Plus</Link>
                  <Link href="/how-to-choose-an-air-fryer">Air Fryer Buying Guide</Link>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <button type="button" className="nav-link">
                About <Chevron />
              </button>
              <div className="nav-dropdown">
                <div className="nav-dropdown-col">
                  <strong>Editorial Standards</strong>
                  <Link href="/about">About TopProductPick</Link>
                  <Link href="/methodology">How We Research</Link>
                  <Link href="/editorial-policy">Editorial Policy</Link>
                  <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
                  <Link href="/contact">Contact Us</Link>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <button type="button" className="nav-link">
                Blog <Chevron />
              </button>
              <div className="nav-dropdown">
                <div className="nav-dropdown-col">
                  <strong>Guides &amp; Advice</strong>
                  <Link href="/how-to-clean-a-coffee-maker">How to Clean a Coffee Maker</Link>
                  <Link href="/how-to-choose-a-water-bottle">How to Choose a Water Bottle</Link>
                  <Link href="/how-to-choose-wireless-earbuds">Wireless Earbuds Guide</Link>
                  <Link href="/categories">All Buying Advice</Link>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-search-icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search bar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {searchOpen && (
        <div className="header-search-bar-expand">
          <div className="container">
            <form action="/search" role="search" className="header-expand-form">
              <input
                type="search"
                name="q"
                autoFocus
                placeholder="Search products, guides, reviews..."
              />
              <button type="submit" className="btn btn-brand">Search</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
