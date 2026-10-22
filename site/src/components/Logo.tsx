import Link from "next/link";
import { siteConfig } from "@/lib/site";

// Logo files are generated from assets/brand/logo-original.jpg by scripts/make-logo.mjs.
// Each logo ships a light and a dark version; CSS shows the one that matches the theme.
export function BrandImage({ variant, height }: { variant: "header" | "full"; height: number }) {
  const base = variant === "header" ? "/images/brand/logo-header" : "/images/brand/logo";
  // Both files share one aspect ratio: 640x185 (header) and 800x232 (full).
  const width = Math.round(height * (variant === "header" ? 640 / 185 : 800 / 232));
  return (
    <>
      <img className="brand-light" src={`${base}.png`} alt={siteConfig.name} width={width} height={height} />
      <img className="brand-dark" src={`${base}-dark.png`} alt="" aria-hidden="true" width={width} height={height} />
    </>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${siteConfig.name} home`}>
      <BrandImage variant="header" height={46} />
    </Link>
  );
}
