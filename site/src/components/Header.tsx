import Link from "next/link";
import navigation from "@/data/navigation.json";
import { getCategoriesByDepartment, getDepartment } from "@/lib/content";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

function Chevron() {
  return (
    <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function Header() {
  // navigation.json lists the department slugs shown in the bar, in order.
  const departments = (navigation as string[]).map((slug) => getDepartment(slug)).filter((d) => d !== null);

  return (
    <header className="site-header">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="container header-row">
        <Logo />
        <form className="header-search" action="/search" role="search">
          <label htmlFor="header-q" className="skip">
            Search
          </label>
          <input id="header-q" name="q" type="search" placeholder="Search products and guides" />
        </form>
        <ThemeToggle />
      </div>
      <nav className="dept-bar" aria-label="Departments">
        <div className="container dept-bar-row">
          <ul className="dept-menu">
            {departments.map((d) => {
              const cats = [...getCategoriesByDepartment(d.slug)].sort((a, b) => a.title.localeCompare(b.title));
              return (
                <li key={d.slug} className="dept-item">
                  <Link href={`/${d.slug}`} className="dept-link">
                    {d.short}
                    <Chevron />
                  </Link>
                  {cats.length > 0 && (
                    <div className="dept-panel">
                      <p className="dept-panel-title">
                        <Link href={`/${d.slug}`}>All {d.title}</Link>
                      </p>
                      <ul>
                        {cats.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/${c.slug}`}>{c.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Link href="/categories" className="all-cats">
            <GridIcon />
            All categories
          </Link>
        </div>
      </nav>
    </header>
  );
}
