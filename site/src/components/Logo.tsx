import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function BrandLogo() {
  return (
    <div className="brand-logo-mark">
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 2L3 7.5V15C3 21.2 7.7 26.8 14 28C20.3 26.8 25 21.2 25 15V7.5L14 2Z" fill="#0f2b48" />
        <path d="M9.5 14.5L12.5 17.5L18.5 10.5" stroke="#f2a93b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="brand-logo-text">
        <strong className="brand-navy">TruePicks</strong>
        <span className="brand-gold">Daily</span>
      </span>
    </div>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo-link" aria-label="TruePicksDaily home">
      <BrandLogo />
    </Link>
  );
}

// Backward compatibility export if needed elsewhere
export function BrandImage({ variant, height }: { variant: "header" | "full"; height: number }) {
  return <BrandLogo />;
}
