import Link from "next/link";
import { departments } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { BrandImage } from "./Logo";

const TRUST = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "How we research" },
  { href: "/editorial-policy", label: "Editorial policy" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms-of-use", label: "Terms of use" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="footer-logo" aria-label={`${siteConfig.name} home`}>
            <BrandImage variant="full" height={64} />
          </Link>
          <p>Research built from manufacturer specs, independent reviews and owner reports.</p>
        </div>
        <div>
          <p className="footer-title">Departments</p>
          <ul>
            {departments.map((d) => (
              <li key={d.slug}>
                <Link href={`/${d.slug}`}>{d.title}</Link>
              </li>
            ))}
            <li>
              <Link href="/categories">All categories</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-title">Company</p>
          <ul>
            {TRUST.map((t) => (
              <li key={t.href}>
                <Link href={t.href}>{t.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer-legal">
        <p>{siteConfig.disclosureLong}</p>
        <p>
          © {new Date().getFullYear()} {siteConfig.organization.legalName}. Prices and availability change; check the retailer for current details.
        </p>
      </div>
    </footer>
  );
}
